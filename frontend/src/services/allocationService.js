import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from './storageAdapter';

export const allocationService = {
  /**
   * Fetches all allocations, resolving linked request, resource, and volunteer
   */
  async getAllocations() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('allocations')
        .select(`
          *,
          emergency_requests (*),
          resources (*),
          volunteers (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase getAllocations error:', error);
        throw new Error(error.message || 'Failed to fetch allocations from Supabase');
      }

      // Format joined fields consistently
      return (data || []).map(item => ({
        ...item,
        request: item.emergency_requests,
        resource: item.resources,
        volunteer: item.volunteers
      }));
    } else {
      const allocations = localStore.getAllocations();
      const requests = localStore.getRequests();
      const resources = localStore.getResources();
      const volunteers = localStore.getVolunteers();

      const populated = allocations.map(item => {
        const req = requests.find(r => r.id === item.request_id) || null;
        const res = resources.find(r => r.id === item.resource_id) || null;
        const vol = volunteers.find(v => v.id === item.volunteer_id) || null;
        return {
          ...item,
          request: req,
          resource: res,
          volunteer: vol
        };
      });

      return populated.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  /**
   * Proposes a new allocation (before approval)
   */
  async proposeAllocation(payload) {
    const record = {
      request_id: payload.request_id,
      resource_id: payload.resource_id,
      volunteer_id: payload.volunteer_id || null,
      quantity: Number(payload.quantity),
      resource_distance_km: Number(payload.resource_distance_km),
      volunteer_distance_km: payload.volunteer_distance_km !== null && payload.volunteer_distance_km !== undefined ? Number(payload.volunteer_distance_km) : null,
      status: 'Proposed',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('allocations')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase proposeAllocation error:', error);
        throw new Error(error.message || 'Failed to create allocation proposal in Supabase');
      }
      return data;
    } else {
      const newRecord = {
        ...record,
        id: crypto.randomUUID ? crypto.randomUUID() : 'alloc-' + Math.random().toString(36).substring(2, 9)
      };
      const existing = localStore.getAllocations();
      localStore.setAllocations([newRecord, ...existing]);
      return newRecord;
    }
  },

  /**
   * Approves an allocation using atomic validation:
   * Rechecks resource quantity, decrements resource inventory, updates request status,
   * marks volunteer as busy, and changes allocation status to 'Approved'.
   */
  async approveAllocation(allocationId) {
    if (isSupabaseConfigured()) {
      // Execute secure database function
      const { data, error } = await supabase.rpc('approve_allocation', {
        p_allocation_id: allocationId
      });

      if (error) {
        console.error('Supabase approve_allocation RPC error:', error);
        throw new Error(error.message || 'Failed to approve allocation in Supabase');
      }

      if (!data.success) {
        throw new Error(data.error || 'Allocation approval rejected by database');
      }

      return data;
    } else {
      // Atomic execution in local store
      const allocations = localStore.getAllocations();
      const resources = localStore.getResources();
      const requests = localStore.getRequests();
      const volunteers = localStore.getVolunteers();

      const allocIndex = allocations.findIndex(a => a.id === allocationId);
      if (allocIndex === -1) {
        throw new Error('Allocation record not found');
      }

      const alloc = allocations[allocIndex];
      if (alloc.status !== 'Proposed') {
        throw new Error(`Allocation cannot be approved from current status '${alloc.status}'`);
      }

      // Re-verify resource
      const resIndex = resources.findIndex(r => r.id === alloc.resource_id);
      if (resIndex === -1) {
        throw new Error('Associated resource not found');
      }

      const res = resources[resIndex];
      if (res.status === 'Unavailable' || res.quantity < alloc.quantity) {
        throw new Error(`Insufficient inventory: Required ${alloc.quantity}, Available: ${res.quantity}`);
      }

      // Deduct resource
      const newQuantity = res.quantity - alloc.quantity;
      resources[resIndex] = {
        ...res,
        quantity: newQuantity,
        status: newQuantity === 0 ? 'Depleted' : 'Available'
      };

      // Update emergency request
      const reqIndex = requests.findIndex(r => r.id === alloc.request_id);
      if (reqIndex !== -1) {
        requests[reqIndex] = {
          ...requests[reqIndex],
          status: 'Assigned'
        };
      }

      // Update volunteer if assigned
      if (alloc.volunteer_id) {
        const volIndex = volunteers.findIndex(v => v.id === alloc.volunteer_id);
        if (volIndex !== -1) {
          volunteers[volIndex] = {
            ...volunteers[volIndex],
            available: false
          };
        }
      }

      // Update allocation status
      allocations[allocIndex] = {
        ...alloc,
        status: 'Approved'
      };

      // Persist atomic changes
      localStore.setResources(resources);
      localStore.setRequests(requests);
      localStore.setVolunteers(volunteers);
      localStore.setAllocations(allocations);

      return {
        success: true,
        message: 'Allocation approved successfully. Resource inventory and volunteer availability updated.'
      };
    }
  },

  /**
   * Rejects a proposed allocation
   */
  async rejectAllocation(allocationId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.rpc('reject_allocation', {
        p_allocation_id: allocationId
      });

      if (error) {
        console.error('Supabase reject_allocation RPC error:', error);
        throw new Error(error.message || 'Failed to reject allocation');
      }
      return data;
    } else {
      const allocations = localStore.getAllocations();
      const allocIndex = allocations.findIndex(a => a.id === allocationId);
      if (allocIndex === -1) throw new Error('Allocation record not found');

      allocations[allocIndex] = {
        ...allocations[allocIndex],
        status: 'Rejected'
      };
      localStore.setAllocations(allocations);
      return { success: true, message: 'Allocation rejected.' };
    }
  },

  /**
   * Completes an allocation and releases volunteer
   */
  async completeAllocation(allocationId) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.rpc('complete_allocation', {
        p_allocation_id: allocationId
      });

      if (error) {
        console.error('Supabase complete_allocation RPC error:', error);
        throw new Error(error.message || 'Failed to complete allocation');
      }
      return data;
    } else {
      const allocations = localStore.getAllocations();
      const requests = localStore.getRequests();
      const volunteers = localStore.getVolunteers();

      const allocIndex = allocations.findIndex(a => a.id === allocationId);
      if (allocIndex === -1) throw new Error('Allocation record not found');
      const alloc = allocations[allocIndex];

      allocations[allocIndex] = { ...alloc, status: 'Completed' };

      // Mark request completed
      const reqIndex = requests.findIndex(r => r.id === alloc.request_id);
      if (reqIndex !== -1) {
        requests[reqIndex] = { ...requests[reqIndex], status: 'Completed' };
      }

      // Release volunteer
      if (alloc.volunteer_id) {
        const volIndex = volunteers.findIndex(v => v.id === alloc.volunteer_id);
        if (volIndex !== -1) {
          volunteers[volIndex] = { ...volunteers[volIndex], available: true };
        }
      }

      localStore.setAllocations(allocations);
      localStore.setRequests(requests);
      localStore.setVolunteers(volunteers);

      return { success: true, message: 'Allocation completed and volunteer released.' };
    }
  }
};

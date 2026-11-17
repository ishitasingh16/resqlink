import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from './storageAdapter';
import { calculatePriority, sortRequestsByPriority } from '../algorithms/priority';

export const requestService = {
  /**
   * Fetches all emergency requests sorted by priority score (descending)
   */
  async getRequests() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('emergency_requests')
        .select('*')
        .order('priority_score', { ascending: false });

      if (error) {
        console.error('Supabase fetchRequests error:', error);
        throw new Error(error.message || 'Failed to fetch emergency requests from Supabase');
      }
      return sortRequestsByPriority(data || []);
    } else {
      // Local demo mode
      const items = localStore.getRequests();
      return sortRequestsByPriority(items);
    }
  },

  /**
   * Creates a new emergency request with automatic priority calculation
   */
  async createRequest(payload) {
    const { urgency, people_affected } = payload;
    const { score, category } = calculatePriority(urgency, people_affected);

    const record = {
      ...payload,
      urgency: Number(payload.urgency),
      quantity: Number(payload.quantity),
      people_affected: Number(payload.people_affected),
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      priority_score: score,
      priority_category: category,
      status: payload.status || 'Pending',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('emergency_requests')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase createRequest error:', error);
        throw new Error(error.message || 'Failed to submit emergency request to Supabase');
      }
      return data;
    } else {
      // Local demo mode
      const newRecord = {
        ...record,
        id: crypto.randomUUID ? crypto.randomUUID() : 'req-' + Math.random().toString(36).substring(2, 9)
      };
      const existing = localStore.getRequests();
      localStore.setRequests([newRecord, ...existing]);
      return newRecord;
    }
  },

  /**
   * Updates an emergency request status
   */
  async updateStatus(id, status) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('emergency_requests')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateStatus error:', error);
        throw new Error(error.message || 'Failed to update request status in Supabase');
      }
      return data;
    } else {
      const items = localStore.getRequests();
      const index = items.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Emergency request not found');
      items[index] = { ...items[index], status };
      localStore.setRequests(items);
      return items[index];
    }
  }
};

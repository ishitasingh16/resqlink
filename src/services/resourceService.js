import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from './storageAdapter';

export const resourceService = {
  /**
   * Fetches all resources
   */
  async getResources(donorFilter = null) {
    if (isSupabaseConfigured()) {
      let query = supabase.from('resources').select('*').order('created_at', { ascending: false });
      if (donorFilter) {
        query = query.eq('donor_name', donorFilter);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Supabase getResources error:', error);
        throw new Error(error.message || 'Failed to fetch resources from Supabase');
      }
      return data || [];
    } else {
      let items = localStore.getResources();
      if (donorFilter) {
        items = items.filter(r => r.donor_name.toLowerCase() === donorFilter.toLowerCase());
      }
      return [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  },

  /**
   * Creates a new donated resource
   */
  async createResource(payload) {
    const record = {
      ...payload,
      quantity: Number(payload.quantity),
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      status: payload.status || 'Available',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('resources')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase createResource error:', error);
        throw new Error(error.message || 'Failed to add resource to Supabase');
      }
      return data;
    } else {
      const newRecord = {
        ...record,
        id: crypto.randomUUID ? crypto.randomUUID() : 'res-' + Math.random().toString(36).substring(2, 9)
      };
      const existing = localStore.getResources();
      localStore.setResources([newRecord, ...existing]);
      return newRecord;
    }
  },

  /**
   * Updates an existing resource (quantity, status, details)
   */
  async updateResource(id, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateResource error:', error);
        throw new Error(error.message || 'Failed to update resource in Supabase');
      }
      return data;
    } else {
      const items = localStore.getResources();
      const index = items.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Resource not found');
      items[index] = { ...items[index], ...updates };
      localStore.setResources(items);
      return items[index];
    }
  },

  /**
   * Convenience method to toggle or mark unavailable
   */
  async setStatus(id, status) {
    return this.updateResource(id, { status });
  }
};

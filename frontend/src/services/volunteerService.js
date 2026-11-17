import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { localStore } from './storageAdapter';

export const volunteerService = {
  /**
   * Fetches all registered volunteers
   */
  async getVolunteers() {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('volunteers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase getVolunteers error:', error);
        throw new Error(error.message || 'Failed to fetch volunteers from Supabase');
      }
      return data || [];
    } else {
      const items = localStore.getVolunteers();
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }
  },

  /**
   * Toggles or updates volunteer availability
   */
  async updateAvailability(id, available) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('volunteers')
        .update({ available: Boolean(available) })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateAvailability error:', error);
        throw new Error(error.message || 'Failed to update volunteer availability');
      }
      return data;
    } else {
      const items = localStore.getVolunteers();
      const index = items.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Volunteer not found');
      items[index] = { ...items[index], available: Boolean(available) };
      localStore.setVolunteers(items);
      return items[index];
    }
  },

  /**
   * Updates volunteer profile information
   */
  async updateProfile(id, updates) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('volunteers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase updateProfile error:', error);
        throw new Error(error.message || 'Failed to update volunteer profile');
      }
      return data;
    } else {
      const items = localStore.getVolunteers();
      const index = items.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Volunteer not found');
      items[index] = { ...items[index], ...updates };
      localStore.setVolunteers(items);
      return items[index];
    }
  },

  /**
   * Creates a new volunteer record
   */
  async createVolunteer(payload) {
    const record = {
      ...payload,
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      has_vehicle: Boolean(payload.has_vehicle),
      available: payload.available !== undefined ? Boolean(payload.available) : true,
      skills: Array.isArray(payload.skills) ? payload.skills : [],
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('volunteers')
        .insert([record])
        .select()
        .single();

      if (error) {
        console.error('Supabase createVolunteer error:', error);
        throw new Error(error.message || 'Failed to register volunteer');
      }
      return data;
    } else {
      const newRecord = {
        ...record,
        id: crypto.randomUUID ? crypto.randomUUID() : 'vol-' + Math.random().toString(36).substring(2, 9)
      };
      const existing = localStore.getVolunteers();
      localStore.setVolunteers([newRecord, ...existing]);
      return newRecord;
    }
  }
};

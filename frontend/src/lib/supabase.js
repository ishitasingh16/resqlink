import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid (and not default placeholders)
export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (supabaseUrl.includes('your-project-id') || supabaseAnonKey.includes('your-anon-key')) return false;
  try {
    const url = new URL(supabaseUrl);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Diagnostics helper
export const getConnectionStatus = () => {
  if (isSupabaseConfigured()) {
    return {
      mode: 'supabase',
      statusText: 'Connected to Supabase PostgreSQL',
      endpoint: supabaseUrl
    };
  }
  return {
    mode: 'demo',
    statusText: 'Demo Mode (Simulated Local Storage)',
    endpoint: 'In-Memory / Browser LocalStorage'
  };
};

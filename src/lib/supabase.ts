import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

if (!supabaseServiceKey) {
  throw new Error('Missing VITE_SUPABASE_SERVICE_ROLE_KEY environment variable');
}

// Create the standard client for authenticated user operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token'
  }
});

// Create a service role client for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Add error handling for failed requests
supabase.handleError = (error: any) => {
  console.error('Supabase error:', error);
  if (error.message === 'JWT expired') {
    // Handle expired token
    supabase.auth.refreshSession();
  }
  return error;
};

// Add connection status check
export const checkConnection = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Clear any stale data if no session exists
      localStorage.clear();
      sessionStorage.clear();
    }
    return !!session;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};
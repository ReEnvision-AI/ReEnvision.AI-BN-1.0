import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(import.meta.env.VITE_SUPA_URL, import.meta.env.VITE_SUPA_PUBLIC_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Initialize auth state
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    // Delete cached user data on sign out
    localStorage.removeItem('supabase.auth.token');
  }
});

export default supabase;

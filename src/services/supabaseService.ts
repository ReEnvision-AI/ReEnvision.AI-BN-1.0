import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Set session expiry to 72 hours (in milliseconds)
const SESSION_EXPIRY = 72 * 60 * 60 * 1000;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const supabaseUrl = import.meta.env.VITE_SUPA_URL;
const supabaseKey = import.meta.env.VITE_SUPA_PUBLIC_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true, // Enable session persistence
    storageKey: 'supabase.auth.token',
    storage: localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
});

// Enhanced auth state change handler
supabase.auth.onAuthStateChange(async (event, session) => {
  try {
    console.log('Auth state change:', event, session?.user?.id);
    
    if (event === 'SIGNED_OUT' || !session) {
      // Clear all session data
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sessionExpiry');
      localStorage.removeItem('lastActivity');
      return;
    }

    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      // Update session expiry and last activity
      const expiryTime = Date.now() + SESSION_EXPIRY;
      localStorage.setItem('sessionExpiry', expiryTime.toString());
      localStorage.setItem('lastActivity', Date.now().toString());
      console.log('Session expiry set to:', new Date(expiryTime).toISOString());
    }
  } catch (error) {
    console.error('Error handling auth state change:', error);
  }
});

// Improved session validation
const checkSessionExpiry = () => {
  try {
    const expiryTime = localStorage.getItem('sessionExpiry');
    const lastActivity = localStorage.getItem('lastActivity');
    const now = Date.now();

    if (!expiryTime || !lastActivity) {
      console.log('No session data found');
      return false;
    }

    // Check absolute session expiry
    if (now > parseInt(expiryTime)) {
      console.log('Session expired');
      supabase.auth.signOut().catch(console.error);
      return false;
    }

    // Check inactivity timeout
    if (now - parseInt(lastActivity) > INACTIVITY_TIMEOUT) {
      console.log('Session timed out due to inactivity');
      supabase.auth.signOut().catch(console.error);
      return false;
    }

    // Session is valid, update last activity
    updateLastActivity();
    console.log('Session is valid');
    return true;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

// Update last activity timestamp
export const isSessionValid = () => checkSessionExpiry();
export const updateLastActivity = () => {
  const now = Date.now().toString();
  localStorage.setItem('lastActivity', now);
  console.log('Last activity updated:', new Date(parseInt(now)).toISOString());
};

// Export functions
export default supabase;

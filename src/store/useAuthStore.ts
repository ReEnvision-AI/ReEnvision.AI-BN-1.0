import { create } from 'zustand';
import supabase, { isSessionValid } from '../services/supabaseService';
import type { AuthState, User } from '../types';

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  getUser: () => User | null;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  signIn: async (email, password) => {
    const { data: userData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Query to see if the user has an active subscription
    if (error) throw error;

    set({user: {id: userData.user.id, email: userData.user.email}})
  },

  signUp: async (email, password) => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;

    if (signUpData.user) {
      set({user: {id: signUpData.user.id, email: signUpData.user.email}});
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
  
  init: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user && isSessionValid()) {
      set({
        user: { id: session.user.id, email: session.user.email },
        loading: false
      });
    }
  },

  getUser: () => get().user,
}));
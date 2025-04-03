import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import supabase from '../services/supabaseService';
import { App } from '../types';

interface AppStore {
  installableApps: App[];
  installedApps: App[];
  loading: boolean;
  error: string | null;
  categories: { id: number; name: string }[];
  fetchInstallableApps: () => Promise<void>;
  fetchInstalledApps: (user_id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  installApp: (user_id: string, app_id: string) => Promise<void>;
  uninstallApp: (user_id: string, app_id: string) => Promise<void>;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      installableApps: [],
      installedApps: [],
      loading: true,
      error: null,
      categories: [],

      fetchCategories: async () => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('id');

        if (error) {
          console.error('Error fetching categories:', error);
          set({ error: 'Failed to fetch categories', loading: false });
          set({ loading: false });
          throw error;
        }

        set({ categories: data || [], loading: false });
      },

      fetchInstallableApps: async () => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('installable_apps')
          .select('*')
          .returns<App[]>();

        if (error) {
          console.error('Error retrieving apps for the app store:', error);
          set({ error: 'Failed to fetch apps', loading: false });
          set({ loading: false });
          throw error;
        }

        set({ installableApps: data || [] });
        set({ loading: false });
      },

      fetchInstalledApps: async (user_id: string) => {
        set({ loading: true });
        // First get the user's installed app IDs
        const { data: userApps, error: userAppsError } = await supabase
          .from('user_apps')
          .select('app_id')
          .eq('user_id', user_id);

        if (userAppsError) {
          console.error('Error retrieving user apps:', userAppsError);
          set({ error: 'Failed to fetch installed apps', loading: false });
          set({ loading: false });
          throw userAppsError;
        }

        // Then get the full app details for those IDs
        const { data, error } = await supabase
          .from('installable_apps')
          .select('*')
          .in('id', userApps?.map(ua => ua.app_id) || []);

        if (error) {
          console.error('Error retrieving apps for user:', error);
          set({ loading: false });
          throw error;
        }

        set({ installedApps: data || [] });
        set({ loading: false });
      },

      installApp: async (user_id: string, app_id: string) => {
        set({ loading: true });
        // Validate inputs
        if (!user_id || !app_id) {
          set({ loading: false });
          throw new Error('User ID and App ID are required');
        }

        // Insert the user-app relationship
        const { error } = await supabase
          .from('user_apps')
          .insert({
            user_id: user_id,
            app_id: app_id
          })
          .select()
          .single();

        if (error) {
          console.error('Error installing app:', error);
          set({ loading: false });
          throw error;
        }

        const app = get().installableApps.find((app) => app.id === app_id);
        if (app) {
          set({ installedApps: [...get().installedApps, app] });
        }
        
        set({ loading: false });
      },

      uninstallApp: async (user_id: string, app_id: string) => {
        set({ loading: true });
        const app = get().installedApps.find((app) => app.id === app_id);
        if (app) {
          const { error } = await supabase.from('user_apps').delete().eq('app_id', app_id).eq('user_id', user_id);
          if (error) {
            console.error('Error uninstalling app:', error);
            set({ loading: false });
            throw error;
          }

          set({
            installedApps: get().installedApps.filter((app) => app.id !== app_id),
          });
        }
        set({ loading: false });
      },
    }),
    { name: 'app-storage' },
  ),
);

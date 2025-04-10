import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import supabase from '../services/supabaseService';
import { App } from '../types';
import { useDesktopStore } from './useDesktopStore'; // Import desktop store

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
          // No need to throw, let the component handle the error state
          return; 
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
          // No need to throw
          return; 
        }

        set({ installableApps: data || [], loading: false });
      },

      fetchInstalledApps: async (user_id: string) => {
        console.log(`[fetchInstalledApps] Called for user_id: ${user_id}`); // DEBUG
        set({ loading: true, error: null }); // Reset error state

        if (!user_id) {
          console.error('[fetchInstalledApps] Error: user_id is missing'); // DEBUG
          set({ error: 'User ID is missing', loading: false });
          return; // Exit early if no user_id
        }

        // First get the user's installed app IDs
        console.log('[fetchInstalledApps] Fetching app IDs from user_apps...'); // DEBUG
        const { data: userApps, error: userAppsError } = await supabase
          .from('user_apps')
          .select('app_id')
          .eq('user_id', user_id);

        if (userAppsError) {
          console.error('[fetchInstalledApps] Error retrieving user app IDs:', userAppsError); // DEBUG
          set({ error: 'Failed to fetch installed app IDs', loading: false });
          // Do not throw here, let the component handle the error state
          return; 
        }

        console.log('[fetchInstalledApps] Fetched user app IDs data:', userApps); // DEBUG

        const appIds = userApps?.map(ua => ua.app_id) || [];
        console.log('[fetchInstalledApps] Extracted app IDs:', appIds); // DEBUG

        // If the user has no installed apps, set installedApps to empty and finish
        if (appIds.length === 0) {
          console.log('[fetchInstalledApps] User has no installed apps.'); // DEBUG
          set({ installedApps: [], loading: false });
          return;
        }

        // Then get the full app details for those IDs
        console.log(`[fetchInstalledApps] Fetching app details for IDs: ${appIds.join(', ')}`); // DEBUG
        const { data: appDetails, error: appDetailsError } = await supabase
          .from('installable_apps')
          .select('*')
          .in('id', appIds); // Use the extracted appIds array

        if (appDetailsError) {
          console.error('[fetchInstalledApps] Error retrieving app details:', appDetailsError); // DEBUG
          set({ error: 'Failed to fetch installed app details', loading: false });
          // Do not throw here
          return; 
        }

        console.log('[fetchInstalledApps] Fetched app details:', appDetails); // DEBUG
        set({ installedApps: appDetails || [], loading: false });
        console.log('[fetchInstalledApps] Completed successfully.'); // DEBUG
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

        // Add app to local installed list
        const app = get().installableApps.find((app) => app.id === app_id);
        if (app) {
          set({ installedApps: [...get().installedApps, app] });

          // Add app to all workspaces in desktop store
          const { backgrounds, updateBackground } = useDesktopStore.getState();
          backgrounds.forEach(bg => {
            if (!bg.appIds.includes(app_id)) {
              updateBackground(bg.id, { appIds: [...bg.appIds, app_id] });
            }
          });
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

          // Remove app from local installed list
          set({
            installedApps: get().installedApps.filter((app) => app.id !== app_id),
          });

          // Remove app from all workspaces in desktop store
          const { backgrounds, updateBackground } = useDesktopStore.getState();
          backgrounds.forEach(bg => {
            if (bg.appIds.includes(app_id)) {
              updateBackground(bg.id, { appIds: bg.appIds.filter(id => id !== app_id) });
            }
          });
        }
        set({ loading: false });
      },
    }),
    { name: 'app-storage' },
  ),
);

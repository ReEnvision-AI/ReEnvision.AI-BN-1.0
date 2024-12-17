import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import supabase from '../services/supabaseService';
import { App } from '../types';

interface AppStore {
  installableApps: App[];
  installedApps: App[];
  loading: boolean;
  categories: string[];
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
      loading: false,
      categories: [],

      fetchInstallableApps: async () => {
        set({ loading: true });
        const { data, error } = await supabase.from('installable_apps').select('*').returns<App[]>();

        if (error) {
          console.error('Error retrieving apps for the app store:', error);
          set({ loading: false });
          throw error;
        }
        set({ loading: false });

        set({ installableApps: data || [] });
      },

      fetchInstalledApps: async (user_id: string) => {
        set({ loading: true });
        const { data, error } = await supabase
          .from('user_apps')
          .select('installable_apps!inner(*)')
          .eq('user_id', user_id);
        if (error) {
          console.error('Error retrieving apps for user:', error);
          set({ loading: false });
          throw error;
        }
        set({ loading: false });

        const t = data.map((item) => item.installable_apps);
        set({ installedApps: t || [] });
      },

      fetchCategories: async () => {},

      installApp: async (user_id: string, app_id: string) => {
        set({ loading: true });
        const { error } = await supabase.from('user_apps').insert({ user_id: user_id, app_id: app_id });
        if (error) {
          console.error('Error installing app:', error);
          set({ loading: false });
          throw error;
        }
        set({ loading: false });

        const app = get().installableApps.find((app) => app.id === app_id);
        if (app) {
          set({ installedApps: [...get().installedApps, app] });
        }
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

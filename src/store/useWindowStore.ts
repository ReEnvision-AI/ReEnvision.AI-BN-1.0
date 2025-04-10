import { create } from 'zustand';
import type { Window } from '../types';
import type { App } from '../api/apps';

const MAX_RECENT_APPS = 8; // Limit the number of recent apps shown

interface Store {
  windows: Window[];
  recentAppIds: string[]; // Added to track recent apps
  removeApp: (id: string) => void;
  openWindow: (app: App) => void;
  closeWindow: (id: string) => void;
  updateWindow: (window: Window) => void;
  bringToFront: (id: string) => void;
  isAppOpen: (app: App) => boolean;
}

// Helper function to update recent apps list
const updateRecentApps = (currentIds: string[], appId: string): string[] => {
  const updatedIds = [appId, ...currentIds.filter(id => id !== appId)];
  return updatedIds.slice(0, MAX_RECENT_APPS);
};

export const useStore = create<Store>((set, get) => ({
  windows: [],
  recentAppIds: [], // Initialize recent apps

  removeApp: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.app.id !== id),
    })),

  openWindow: (app) => {
    set((state) => {
      // Check if already open
      const existingWindow = state.windows.find(w => w.app.id === app.id);
      if (existingWindow) {
        // If minimized, restore and bring to front
        if (existingWindow.isMinimized) {
          const updatedWindow = { ...existingWindow, isMinimized: false };
          const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));
          updatedWindow.zIndex = maxZIndex + 1;
          
          return {
            windows: state.windows.map(w => w.id === updatedWindow.id ? updatedWindow : w),
            recentAppIds: updateRecentApps(state.recentAppIds, app.id) // Update recent apps
          };
        } else {
          // Just bring to front if already open and not minimized
          const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));
          return {
            windows: state.windows.map((window) => ({
              ...window,
              zIndex: window.app.id === app.id ? maxZIndex + 1 : window.zIndex,
            })),
            recentAppIds: updateRecentApps(state.recentAppIds, app.id) // Update recent apps
          };
        }
      }

      // If not open, create new window
      const newWindow: Window = {
        id: `${app.id}-${Date.now()}`,
        app,
        isMinimized: false,
        isMaximized: false,
        zIndex: state.windows.length + 1,
        position: {
          x: 50 + state.windows.length * 20,
          y: 50 + state.windows.length * 20,
        },
        size: {
          width: app.preferred_width ? app.preferred_width : 800,
          height: app.preferred_height ? app.preferred_height : 600,
        },
      };

      return {
        windows: [...state.windows, newWindow],
        recentAppIds: updateRecentApps(state.recentAppIds, app.id) // Update recent apps
      };
    });
  },


  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.id !== id),
      // Note: We don't remove from recentAppIds on close, only on open/bringToFront
    })),

  updateWindow: (updatedWindow) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === updatedWindow.id ? updatedWindow : window)),
    })),

  bringToFront: (id) =>
    set((state) => {
      const windowToFront = state.windows.find(w => w.id === id);
      if (!windowToFront) return state; // Should not happen

      const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));
      return {
        windows: state.windows.map((window) => ({
          ...window,
          zIndex: window.id === id ? maxZIndex + 1 : window.zIndex,
        })),
        recentAppIds: updateRecentApps(state.recentAppIds, windowToFront.app.id) // Update recent apps
      };
    }),

  isAppOpen(app: App) {
    const appOpen = get().windows.find((window) => window.app.id === app.id);
    return !!appOpen; // Return boolean
  },
}));

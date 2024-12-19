import { create } from 'zustand';
import type { Window } from '../types';
import type { App } from '../api/apps';

export interface Store {
  windows: Window[];
  removeApp: (id: string) => void;
  openWindow: (app: App) => void;
  closeWindow: (id: string) => void;
  updateWindow: (window: Window) => void;
  bringToFront: (id: string) => void;
  isAppOen: (app: App) => boolean;
}

export const useStore = create<Store>((set, get) => ({
  windows: [],

  removeApp: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.app.id !== id),
    })),

  openWindow: (app) => {
    const appOpen = get().windows.find((window) => window.app.id === app.id);
    if (appOpen) {
      return;
    }

    set((state) => ({
      windows: [
        ...state.windows,
        {
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
        },
      ],
    }));
  },

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((window) => window.id !== id),
    })),

  updateWindow: (updatedWindow) =>
    set((state) => ({
      windows: state.windows.map((window) => (window.id === updatedWindow.id ? updatedWindow : window)),
    })),

  bringToFront: (id) =>
    set((state) => {
      const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex));
      return {
        windows: state.windows.map((window) => ({
          ...window,
          zIndex: window.id === id ? maxZIndex + 1 : window.zIndex,
        })),
      };
    }),

  isAppOen(app: App) {
    const appOpen = get().windows.find((window) => window.app.id === app.id);
    if (appOpen) {
      return true;
    }

    return false;
  },
}));

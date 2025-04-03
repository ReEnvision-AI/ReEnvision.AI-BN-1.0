import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { App } from '../api/apps';

interface DesktopSettings {
  background: string;
  backgroundColor: string;
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right';
  taskbarOpacity: number;
  taskbarAutoHide: boolean;
  taskbarSize: number;
}

interface DesktopBackground {
  id: string;
  name: string;
  style: string;
  color?: string;
  appIds: string[];
}

interface DesktopStore {
  settings: DesktopSettings;
  backgrounds: DesktopBackground[];
  activeBackgroundId: string;
  updateSettings: (settings: Partial<DesktopSettings>) => void;
  addBackground: (background: Omit<DesktopBackground, 'id'>) => void;
  updateBackground: (id: string, background: Partial<DesktopBackground>) => void;
  removeBackground: (id: string) => void;
  setActiveBackground: (id: string) => void;
  cycleBackground: () => void;
}

const defaultSettings: DesktopSettings = {
  background: 'linear-gradient(to bottom, #0f1c3f, #1a2b4a)',
  backgroundColor: '#1a2a42',
  taskbarPosition: 'bottom',
  taskbarOpacity: 0.95,
  taskbarAutoHide: false,
  taskbarSize: 68, // Increased by 7% (64 * 1.07 ≈ 68)
};
const defaultBackgrounds: DesktopBackground[] = [
  {
    id: 'default',
    name: 'Main Workspace',
    style: 'linear-gradient(to bottom, #0f1c3f, #1a2b4a)',
    appIds: ['file-system', 'f8ad4840-ab66-478b-94dd-412cd9da678c', 'settings']
  },
  {
    id: 'productivity',
    name: 'Productivity',
    style: 'linear-gradient(to right, #2193b0, #6dd5ed)',
    appIds: ['file-system', 'f8ad4840-ab66-478b-94dd-412cd9da678c', 'settings']
  },
  {
    id: 'development',
    name: 'Development',
    style: 'linear-gradient(to bottom right, #000428, #004e92)',
    appIds: ['file-system', 'f8ad4840-ab66-478b-94dd-412cd9da678c', 'settings']
  }
];

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      backgrounds: defaultBackgrounds,
      activeBackgroundId: 'default',
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      addBackground: (background) =>
        set((state) => ({
          backgrounds: [...state.backgrounds, { ...background, id: crypto.randomUUID() }]
        })),
      updateBackground: (id, background) =>
        set((state) => ({
          backgrounds: state.backgrounds.map(bg =>
            bg.id === id ? { ...bg, ...background } : bg
          )
        })),
      removeBackground: (id) =>
        set((state) => ({
          backgrounds: state.backgrounds.filter(bg => bg.id !== id),
          activeBackgroundId: state.activeBackgroundId === id ? 'default' : state.activeBackgroundId
        })),
      setActiveBackground: (id) =>
        set({ activeBackgroundId: id }),
      cycleBackground: () =>
        set((state) => {
          const currentIndex = state.backgrounds.findIndex(bg => bg.id === state.activeBackgroundId);
          const nextIndex = (currentIndex + 1) % state.backgrounds.length;
          return { activeBackgroundId: state.backgrounds[nextIndex].id };
        }),
    }),
    { name: 'desktop-settings' }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Tab {
  id: string;
  url: string;
  title: string;
}

interface AIProvider {
  type: 'openai' | 'anthropic' | 'local';
  apiKey: string;
  model: string;
}

interface BrowserState {
  tabs: Tab[];
  activeTab: Tab | null;
  aiProvider: AIProvider;
  addTab: (tab: Omit<Tab, 'id'>) => void;
  removeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  setActiveTab: (id: string) => void;
  updateAIProvider: (updates: Partial<AIProvider>) => void;
}

export const useBrowserStore = create<BrowserState>()(
  persist(
    (set) => ({
      tabs: [],
      activeTab: null,
      aiProvider: {
        type: 'openai',
        apiKey: '',
        model: 'gpt-4'
      },

      addTab: (tab) => set((state) => {
        const newTab = { ...tab, id: Date.now().toString() };
        return {
          tabs: [...state.tabs, newTab],
          activeTab: newTab
        };
      }),

      removeTab: (id) => set((state) => {
        const newTabs = state.tabs.filter((tab) => tab.id !== id);
        return {
          tabs: newTabs,
          activeTab: state.activeTab?.id === id
            ? newTabs[newTabs.length - 1] || null
            : state.activeTab
        };
      }),

      updateTab: (id, updates) => set((state) => ({
        tabs: state.tabs.map((tab) =>
          tab.id === id ? { ...tab, ...updates } : tab
        ),
        activeTab: state.activeTab?.id === id
          ? { ...state.activeTab, ...updates }
          : state.activeTab
      })),

      setActiveTab: (id) => set((state) => ({
        activeTab: state.tabs.find((tab) => tab.id === id) || null
      })),

      updateAIProvider: (updates) => set((state) => ({
        aiProvider: { ...state.aiProvider, ...updates }
      }))
    }),
    {
      name: 'browser-storage',
      partialize: (state) => ({
        aiProvider: state.aiProvider
      })
    }
  )
);
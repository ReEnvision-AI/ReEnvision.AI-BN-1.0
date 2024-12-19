import { create } from 'zustand';
import { aiService, type Model, type Provider } from '../services/aiService';

interface SystemStats {
    cpu: number;
    memory: number;
    temperature: number;
    requests: number;
}

interface Message {
    role: "system" | "user" | "assistant" | "error";
    content: string;
}


interface ChatStore {
    messages: Message[];
    isGenerating: boolean;
    modelStatus: string;
    activeModelId: string | null;
    error: string | null;
    availableModels: Model[];
    systemStats: SystemStats;
    apiKey: string;
    anthropicKey?: string;
    apiProvider?: Provider;
    initializeChat: () => Promise<void>;
    setApiKey: (apiKey: string, provider?: Provider) => Promise<void>;
    chat: (content: string) => Promise<void>;
    setActiveModel: (modelId: string) => void;
    clearChat: () => void;
    updateSystemStats: (stats: SystemStats) => void;

}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isGenerating: false,
  modelStatus: 'initializing',
  activeModelId: null,
  availableModels: [],
  error: null,
  apiKey: "",
  systemStats: {
    cpu: 0,
    memory: 0,
    temperature: 0,
    requests: 0
  },

  initializeChat: async () => {
    try {
      if (!aiService.isConfigured()) {
        set({ modelStatus: 'error', error: 'AI service not configured' });
        return;
      }

      const models = await aiService.getAvailableModels();
      set({ 
        availableModels: models,
        modelStatus: 'ready',
        error: null
      });
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      set({ 
        modelStatus: 'error',
        error: error.message 
      });
    }
  },

  setApiKey: async (apiKey, provider: Provider = 'openai') => {
    try {
      await aiService.configure({ provider, apiKey });
      const models = await aiService.getAvailableModels();
      
      set({ 
        availableModels: models,
        modelStatus: 'ready',
        apiKey: apiKey,
        apiProvider: provider,
        error: null
      });
    } catch (error) {
      console.error('API connection error:', error);
      set({ 
        error: error.message || 'Failed to connect to API',
        modelStatus: 'error' 
      });
      throw error;
    }
  },

  chat: async (content) => {
    const { activeModelId } = get();
    
    if (!aiService.isConfigured()) {
      throw new Error('Please configure AI service first');
    }

    if (!activeModelId) {
      throw new Error('Please select a model first');
    }

    set(state => ({ 
      messages: [...state.messages, { role: 'user', content }],
      isGenerating: true,
      error: null
    }));

    try {
      let fullResponse = '';
      await aiService.generateText(content, {
        model: activeModelId,
        stream: true,
        onToken: (token) => {
          fullResponse += token;
          set(state => ({
            messages: [
              ...state.messages.slice(0, -1),
              { role: 'assistant', content: fullResponse }
            ]
          }));
        }
      });

      set({ isGenerating: false });
    } catch (error) {
      console.error('Generation failed:', error);
      set(state => ({ 
        messages: [
          ...state.messages,
          { 
            role: 'error', 
            content: error.message || 'Failed to generate response'
          }
        ],
        isGenerating: false,
        error: error.message || 'Failed to generate response'
      }));
    }
  },

  setActiveModel: (modelId) => {
    set({ activeModelId: modelId });
  },

  clearChat: () => {
    set({ messages: [] });
  },

  updateSystemStats: (stats) => {
    set({ systemStats: stats });
  }
}));

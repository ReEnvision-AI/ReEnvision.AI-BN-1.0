import { create } from 'zustand';
import OpenAI from 'openai';

const createOpenAIClient = (apiKey) => {
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const useChatyStore = create((set, get) => ({
  messages: [],
  isGenerating: false,
  modelStatus: 'initializing',
  activeModelId: null,
  availableModels: [],
  downloadedModels: [],
  downloadProgress: {},
  apiKey: '',
  openAIClient: null,
  error: null,
  systemStats: {
    cpu: 0,
    memory: 0,
    temperature: 0,
    requests: 0
  },

  initializeChat: async () => {
    try {
      // Load API key from localStorage if available
      const savedApiKey = localStorage.getItem('chatyai_api_key');
      if (savedApiKey) {
        const client = createOpenAIClient(savedApiKey);
        set({ 
          openAIClient: client,
          apiKey: savedApiKey,
          modelStatus: 'ready' 
        });
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      set({ 
        modelStatus: 'error',
        error: error.message 
      });
    }
  },

  setApiKey: (apiKey) => {
    try {
      const client = createOpenAIClient(apiKey);
      localStorage.setItem('chatyai_api_key', apiKey);
      set({ 
        openAIClient: client,
        apiKey,
        modelStatus: 'ready',
        error: null 
      });
    } catch (error) {
      set({ 
        error: 'Invalid API key configuration',
        modelStatus: 'error' 
      });
    }
  },

  sendMessage: async (content) => {
    const { openAIClient, messages } = get();
    if (!openAIClient) {
      set({ error: 'Please configure your API key first' });
      return;
    }

    const message = { role: 'user', content };
    set(state => ({ 
      messages: [...state.messages, message],
      isGenerating: true,
      error: null
    }));

    try {
      const stream = await openAIClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [...messages, message],
        stream: true
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        
        set(state => ({
          messages: [
            ...state.messages.slice(0, -1),
            { role: 'assistant', content: fullResponse }
          ]
        }));
      }

      set({ isGenerating: false });
    } catch (error) {
      console.error('Generation failed:', error);
      set({ 
        isGenerating: false,
        error: error.message || 'Failed to generate response'
      });
    }
  },

  stopGeneration: () => {
    const { openAIClient } = get();
    if (openAIClient) {
      // Abort any ongoing requests
      openAIClient.abortRequest();
      set({ isGenerating: false });
    }
  },

  clearChat: () => {
    set({ messages: [] });
  },

  updateSystemStats: (stats) => {
    set({ systemStats: stats });
  }
}));
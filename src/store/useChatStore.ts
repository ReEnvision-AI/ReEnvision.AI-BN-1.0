import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
    timestamp?: number;
}

interface ChatHistory {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

interface ChatStore {
    messages: Message[];
    chatHistory: ChatHistory[];
    currentChatId: string | null;
    isGenerating: boolean;
    modelStatus: string;
    activeModelId: string | null;
    error: string | null;
    availableModels: Model[];
    systemStats: SystemStats;
    apiKey: string;
    anthropicKey?: string;
    apiProvider?: Provider;
    baseUrl?: string;
    initializeChat: () => Promise<void>;
    setApiKey: (apiKey: string, provider?: Provider, baseUrl?: string) => Promise<void>;
    chat: (content: string) => Promise<void>;
    setActiveModel: (modelId: string) => void;
    clearChat: () => void;
    updateSystemStats: (stats: SystemStats) => void;
    createNewChat: () => void;
    loadChat: (chatId: string) => void;
    deleteChat: (chatId: string) => void;
    updateChatTitle: (chatId: string, title: string) => void;
    summarizeAndTitleChat: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>(
  persist(
    (set, get) => ({
      messages: [],
      chatHistory: [],
      currentChatId: null,
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

      createNewChat: () => {
        const newChat: ChatHistory = {
          id: crypto.randomUUID(),
          title: `New Chat`,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          chatHistory: [...state.chatHistory, newChat],
          currentChatId: newChat.id,
          messages: []
        }));
      },

      loadChat: (chatId: string) => {
        const state = get();
        const chat = state.chatHistory.find((c) => c.id === chatId);
        if (chat) {
          set({
            currentChatId: chatId,
            messages: [...chat.messages]
          });
        }
      },

      deleteChat: (chatId: string) => {
        const state = get();
        const newHistory = state.chatHistory.filter((c) => c.id !== chatId);
        const isCurrentChat = state.currentChatId === chatId;
        
        set({
          chatHistory: newHistory,
          currentChatId: isCurrentChat ? null : state.currentChatId,
          messages: isCurrentChat ? [] : state.messages
        });
      },

      updateChatTitle: (chatId: string, title: string) => {
        if (!title.trim()) return;
        
        set((state) => ({
          chatHistory: state.chatHistory.map((chat) =>
            chat.id === chatId
              ? { ...chat, title: title.trim(), updatedAt: Date.now() }
              : chat
          )
        }));
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

      setApiKey: async (apiKey, provider: Provider = 'openai', baseUrl?: string) => {
        try {
          await aiService.configure({ provider, apiKey, baseUrl });
          const models = await aiService.getAvailableModels();
          
          set({ 
            availableModels: models,
            modelStatus: 'ready',
            apiKey: apiKey,
            apiProvider: provider,
            baseUrl: baseUrl,
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
        const { activeModelId, currentChatId } = get();
        
        if (!aiService.isConfigured()) {
          throw new Error('Please configure AI service first');
        }

        if (!activeModelId) {
          throw new Error('Please select a model first');
        }

        if (!currentChatId) {
          throw new Error('Please create a new chat first');
        }

        const userMessage: Message = { 
          role: 'user', 
          content,
          timestamp: Date.now()
        };

        // Add user message
        set(state => {
          const updatedMessages = [...state.messages, userMessage];
          const updatedHistory = state.chatHistory.map(chat => 
            chat.id === state.currentChatId
              ? { ...chat, messages: updatedMessages, updatedAt: Date.now() }
              : chat
          );

          return { 
            messages: updatedMessages,
            chatHistory: updatedHistory,
            isGenerating: true,
            error: null
          };
        });

        try {
          // Create initial assistant message
          const assistantMessage: Message = {
            role: 'assistant',
            content: '',
            timestamp: Date.now()
          };

          // Add empty assistant message to start
          set(state => {
            const updatedMessages = [...state.messages, assistantMessage];
            const updatedHistory = state.chatHistory.map(chat => 
              chat.id === state.currentChatId
                ? { ...chat, messages: updatedMessages, updatedAt: Date.now() }
                : chat
            );

            return {
              messages: updatedMessages,
              chatHistory: updatedHistory
            };
          });

          let fullResponse = '';
          await aiService.generateText(content, {
            model: activeModelId,
            stream: true,
            onToken: (token) => {
              fullResponse += token;
              
              // Update the last message (assistant's message)
              set(state => {
                const newMessages = [...state.messages];
                newMessages[newMessages.length - 1] = {
                  ...newMessages[newMessages.length - 1],
                  content: fullResponse,
                  timestamp: Date.now()
                };

                const updatedHistory = state.chatHistory.map(chat => 
                  chat.id === state.currentChatId
                    ? { ...chat, messages: newMessages, updatedAt: Date.now() }
                    : chat
                );

                return {
                  messages: newMessages,
                  chatHistory: updatedHistory
                };
              });
            }
          });

          set({ isGenerating: false });

          // Generate title after the first exchange
          const currentChat = get().chatHistory.find(c => c.id === get().currentChatId);
          if (currentChat && currentChat.messages.length === 3) {
            await get().summarizeAndTitleChat(currentChat.id);
          }

        } catch (error) {
          console.error('Generation failed:', error);
          const errorMessage: Message = { 
            role: 'error', 
            content: error.message || 'Failed to generate response',
            timestamp: Date.now()
          };

          set(state => {
            const updatedMessages = [...state.messages, errorMessage];
            const updatedHistory = state.chatHistory.map(chat => 
              chat.id === state.currentChatId
                ? { ...chat, messages: updatedMessages, updatedAt: Date.now() }
                : chat
            );

            return { 
              messages: updatedMessages,
              chatHistory: updatedHistory,
              isGenerating: false,
              error: error.message || 'Failed to generate response'
            };
          });
        }
      },

      setActiveModel: (modelId) => {
        set({ activeModelId: modelId });
      },

      clearChat: () => {
        const { currentChatId } = get();
        if (currentChatId) {
          set(state => ({
            messages: [],
            chatHistory: state.chatHistory.map(chat => 
              chat.id === currentChatId
                ? { ...chat, messages: [], updatedAt: Date.now() }
                : chat
            )
          }));
        }
      },

      updateSystemStats: (stats) => {
        set({ systemStats: stats });
      },

      summarizeAndTitleChat: async (chatId: string) => {
        const chat = get().chatHistory.find((c) => c.id === chatId);
        if (!chat || chat.messages.length < 2) return;

        const prompt = `Please provide a very brief title (maximum 4-5 words) for this conversation. Here's the chat history:
          ${chat.messages.map(m => `${m.role}: ${m.content}`).join('\n')}`;

        try {
          const title = await aiService.generateText(prompt, {
            model: get().activeModelId || 'gpt-3.5-turbo',
            maxTokens: 20,
            temperature: 0.7
          });

          const cleanTitle = title.replace(/["']/g, '').trim();

          set((state) => ({
            chatHistory: state.chatHistory.map((c) =>
              c.id === chatId
                ? { ...chat, title: cleanTitle, updatedAt: Date.now() }
                : c
            ),
          }));
        } catch (error) {
          console.error('Failed to generate chat title:', error);
        }
      }
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({
        chatHistory: state.chatHistory,
        apiKey: state.apiKey,
        anthropicKey: state.anthropicKey,
        apiProvider: state.apiProvider,
        baseUrl: state.baseUrl,
        activeModelId: state.activeModelId
      })
    }
  )
);

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface AIServiceConfig {
  provider: 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export interface Model {
  name: string;
  id: string;
  provider: Provider;
}

export type Provider = "openai" | "anthropic" | "custom";

class AIService {
  private static instance: AIService;
  private openAIClient: OpenAI | null = null;
  private anthropicClient: Anthropic | null = null;
  private customClient: OpenAI | null = null;
  private currentProvider: Provider = 'openai';
  private baseUrl: string | null = null;

  private constructor() {
    this.loadSavedConfig();
  }

  private loadSavedConfig() {
    const savedConfig = localStorage.getItem('ai_service_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      this.configure(config).catch(console.error);
    }
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async configure(config: AIServiceConfig): Promise<void> {
    try {
      switch (config.provider) {
        case 'openai':
          this.openAIClient = new OpenAI({
            apiKey: config.apiKey,
            dangerouslyAllowBrowser: true
          });
          await this.openAIClient.models.list(); // Test connection
          break;

        case 'anthropic':
          this.anthropicClient = new Anthropic({
            apiKey: config.apiKey
          });
          break;

        case 'custom':
          if (!config.baseUrl) {
            throw new Error('Base URL is required for custom provider');
          }
          this.customClient = new OpenAI({
            apiKey: config.apiKey || 'not-needed',
            baseURL: config.baseUrl,
            dangerouslyAllowBrowser: true
          });
          break;
      }

      this.currentProvider = config.provider;
      this.baseUrl = config.baseUrl || null;
      
      // Save configuration
      localStorage.setItem('ai_service_config', JSON.stringify({
        provider: config.provider,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl
      }));
    } catch (error) {
      throw new Error(`Failed to configure AI service: ${error.message}`);
    }
  }

  async getAvailableModels(): Promise<Model[]> {
    try {
      switch (this.currentProvider) {
        case 'openai':
          if (this.openAIClient) {
            const response = await this.openAIClient.models.list();
            return response.data.map(model => ({
              id: model.id,
              name: model.id,
              provider: 'openai'
            }));
          }
          break;

        case 'anthropic':
          if (this.anthropicClient) {
            return [
              {
                id: 'claude-2',
                name: 'Claude 2',
                provider: 'anthropic'
              },
              {
                id: 'claude-instant-1',
                name: 'Claude Instant',
                provider: 'anthropic'
              }
            ];
          }
          break;

        case 'custom':
          if (this.customClient) {
            try {
              const response = await this.customClient.models.list();
              return response.data.map(model => ({
                id: model.id,
                name: model.id,
                provider: 'custom'
              }));
            } catch {
              // If model list fails, return a default model
              return [{
                id: 'default-model',
                name: 'Default Model',
                provider: 'custom'
              }];
            }
          }
          break;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  }

  async generateText(prompt: string, options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    stream?: boolean;
    onToken?: (token: string) => void;
  } = {}) {
    try {
      switch (this.currentProvider) {
        case 'openai':
          if (this.openAIClient) {
            return this.handleOpenAIGeneration(prompt, options);
          }
          break;

        case 'anthropic':
          if (this.anthropicClient) {
            return this.handleAnthropicGeneration(prompt, options);
          }
          break;

        case 'custom':
          if (this.customClient) {
            return this.handleOpenAIGeneration(prompt, options, this.customClient);
          }
          break;
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  private async handleOpenAIGeneration(
    prompt: string,
    options: any,
    client: OpenAI = this.openAIClient!
  ) {
    const response = await client.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      stream: options.stream
    });

    if (options.stream) {
      let fullResponse = '';
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        options.onToken?.(content);
      }
      return fullResponse;
    } else {
      return response.choices[0]?.message?.content || '';
    }
  }

  private async handleAnthropicGeneration(prompt: string, options: any) {
    const response = await this.anthropicClient!.messages.create({
      model: options.model || 'claude-2',
      max_tokens: options.maxTokens,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });
    return response.content[0].text;
  }

  getProvider() {
    return this.currentProvider;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  isConfigured() {
    return !!(this.openAIClient || this.anthropicClient || this.customClient);
  }
}

export const aiService = AIService.getInstance();

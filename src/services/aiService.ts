import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface AIServiceConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
}

export interface Model {
    name: string;
    id: string;
    provider: Provider;
}

export type Provider = "openai" | "anthropic";

class AIService {
  private static instance: AIService;
  private openAIClient: OpenAI | null = null;
  private anthropicClient: Anthropic | null = null;
  private currentProvider: Provider = 'openai';

  private constructor() {
    // Load saved configuration
    const savedConfig = localStorage.getItem('ai_service_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      this.configure(config);
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
      if (config.provider === 'openai') {
        this.openAIClient = new OpenAI({
          apiKey: config.apiKey,
          dangerouslyAllowBrowser: true
        });
        await this.openAIClient.models.list(); // Test connection
      } else {
        this.anthropicClient = new Anthropic({
          apiKey: config.apiKey
        });
      }

      this.currentProvider = config.provider;
      localStorage.setItem('ai_service_config', JSON.stringify(config));
    } catch (error) {
      throw new Error(`Failed to configure AI service: ${error.message}`);
    }
  }

  async getAvailableModels() : Promise<Model[]> {
    try {
      if (this.currentProvider === 'openai' && this.openAIClient) {
        const response = await this.openAIClient.models.list();
        return response.data.map(model => ({
          id: model.id,
          name: model.id,
          provider: 'openai'
        }));
      } else if (this.anthropicClient) {
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
      return [];
    } catch (error) {
      throw new Error(`Failed to fetch models: ${error.message}`);
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
      if (this.currentProvider === 'openai' && this.openAIClient) {
        const response = await this.openAIClient.chat.completions.create({
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
      } else if (this.anthropicClient) {
        const response = await this.anthropicClient.messages.create({
          model: options.model || 'claude-2',
          max_tokens: options.maxTokens,
          messages: [{
            role: 'user',
            content: prompt
          }]
        });
        return response.content[0].text;
      }

      throw new Error('No AI provider configured');
    } catch (error) {
      throw new Error(`AI generation failed: ${error.message}`);
    }
  }

  async generateImage(prompt: string, options: {
    size?: '256x256' | '512x512' | '1024x1024';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
  } = {}) {
    try {
      if (this.currentProvider !== 'openai' || !this.openAIClient) {
        throw new Error('Image generation is only available with OpenAI');
      }

      const response = await this.openAIClient.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'vivid'
      });

      return response.data[0]?.url;
    } catch (error) {
      throw new Error(`Image generation failed: ${error.message}`);
    }
  }

  async analyzeImage(image: string, prompt: string) {
    try {
      if (this.currentProvider !== 'openai' || !this.openAIClient) {
        throw new Error('Image analysis is only available with OpenAI');
      }

      const response = await this.openAIClient.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: image }
            ]
          }
        ]
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      throw new Error(`Image analysis failed: ${error.message}`);
    }
  }

  getProvider() {
    return this.currentProvider;
  }

  isConfigured() {
    return !!(this.openAIClient || this.anthropicClient);
  }
}

export const aiService = AIService.getInstance();
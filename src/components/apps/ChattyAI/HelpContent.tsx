import React from 'react';
import { Bot, MessageSquare, Sparkles, Zap, Lock, Globe } from 'lucide-react';

export function HelpContent() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">Welcome to ReEnvision AI</h1>
        <p className="text-gray-400">Your intelligent AI assistant powered by state-of-the-art language models</p>
      </div>

      <div className="grid gap-6">
        <section className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Getting Started</h2>
          </div>
          <p className="text-gray-300 mb-4">
            ReEnvision AI provides a powerful chat interface that connects to various AI models. 
            Configure your preferred AI service in settings and start chatting right away.
          </p>
          <ul className="space-y-2 text-gray-400">
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Create a new chat from the sidebar
            </li>
            <li className="flex items-center gap-2">
              <Bot className="w-4 h-4" /> Select your preferred AI model
            </li>
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4" /> Start chatting and get instant responses
            </li>
          </ul>
        </section>

        <section className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Supported AI Services</h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="bg-blue-500/10 p-2 rounded">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">OpenAI</h3>
                <p className="text-gray-400">Access GPT models with your OpenAI API key</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-purple-500/10 p-2 rounded">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Anthropic</h3>
                <p className="text-gray-400">Use Claude models with your Anthropic API key</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-green-500/10 p-2 rounded">
                <Globe className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Custom Endpoints</h3>
                <p className="text-gray-400">Connect to your own AI endpoints or other providers</p>
              </div>
            </li>
          </ul>
        </section>

        <section className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Features</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li className="bg-gray-700/50 rounded p-3 text-gray-300">Multiple chat sessions</li>
            <li className="bg-gray-700/50 rounded p-3 text-gray-300">Real-time streaming responses</li>
            <li className="bg-gray-700/50 rounded p-3 text-gray-300">Message history</li>
            <li className="bg-gray-700/50 rounded p-3 text-gray-300">System resource monitoring</li>
            <li className="bg-gray-700/50 rounded p-3 text-gray-300">Multiple AI providers</li>
            <li className="bg-gray-700/50 rounded p-3 text-gray-300">Custom API endpoints</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

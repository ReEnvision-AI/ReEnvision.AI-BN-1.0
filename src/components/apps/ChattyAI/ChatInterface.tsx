import React, { useEffect, useRef, useState } from 'react';
import { Send, Loader2, Bot, User, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { Settings } from './Settings';
import { useChatStore } from '../../../store/useChatStore';

export function ChatInterface() {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const { 
    messages, 
    isGenerating, 
    chat, 
    clearChat,
    activeModelId,
    apiKey
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    if (!activeModelId) {
      alert('Please select a model first');
      return;
    }

    if (!apiKey && activeModelId.includes('gpt')) {
      setShowSettings(true);
      return;
    }

    await chat(input);
    setInput('');
  };

  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <h2 className="text-sm font-medium text-gray-400">Chat Session</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
          <button
            onClick={clearChat}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`
              flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}
            `}
          >
            {message.role !== 'user' && (
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <div
              className={`
                max-w-[80%] rounded-lg p-3
                ${message.role === 'user'
                  ? 'bg-blue-500/10 text-blue-100'
                  : message.role === 'error'
                  ? 'bg-red-500/10 text-red-200'
                  : 'bg-gray-800 text-gray-100'}
              `}
            >
              {message.content}
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

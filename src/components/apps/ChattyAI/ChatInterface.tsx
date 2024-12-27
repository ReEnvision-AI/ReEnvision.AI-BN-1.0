import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Send, Loader2, Bot, User, Settings as SettingsIcon, MessageSquare, PlusCircle } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
  onOpenSettings: () => void;
}

export function ChatInterface({ onOpenSettings }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    messages = [], // Provide default empty array
    isGenerating, 
    chat, 
    activeModelId,
    apiKey,
    currentChatId,
    createNewChat,
    apiProvider
  } = useChatStore();

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (!autoScroll || !messagesEndRef.current) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior,
        block: 'end'
      });
    }, 50);
  }, [autoScroll]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;
    
    if (isAtBottom !== autoScroll) {
      setAutoScroll(isAtBottom);
    }
  }, [autoScroll]);

  const throttledScrollHandler = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(handleScroll, 100);
  }, [handleScroll]);

  useEffect(() => {
    // Only scroll if we have messages
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isGenerating) {
      scrollToBottom('smooth');
    }
  }, [isGenerating, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    if (!activeModelId) {
      alert('Please select a model first');
      return;
    }

    if (!currentChatId) {
      alert('Please create a new chat first');
      return;
    }

    setAutoScroll(true);
    scrollToBottom('instant');
    await chat(input);
    setInput('');
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show configuration message if no API is configured
  if (!apiKey && !apiProvider) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <SettingsIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">AI Service Not Configured</h3>
        <p className="text-gray-400 mb-4">Please configure your AI service settings to start chatting</p>
        <button
          onClick={onOpenSettings}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Configure AI Service
        </button>
      </div>
    );
  }

  // Show welcome message if no chat is selected
  if (!currentChatId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Welcome to Chatty AI</h3>
        <p className="text-gray-400 mb-6">Start a new conversation to begin chatting</p>
        <button
          onClick={createNewChat}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          New Chat
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none flex items-center justify-between p-2 border-b border-gray-800">
        <h2 className="text-sm font-medium text-gray-400">Chat Session</h2>
        <button
          onClick={onOpenSettings}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>

      <div 
        ref={scrollContainerRef}
        onScroll={throttledScrollHandler}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`
                flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}
              `}
            >
              {message.role !== 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div
                  className={`
                    rounded-lg p-3
                    ${message.role === 'user'
                      ? 'bg-blue-500/10 text-blue-100'
                      : message.role === 'error'
                      ? 'bg-red-500/10 text-red-200'
                      : 'bg-gray-800 text-gray-100'}
                  `}
                >
                  {message.content}
                </div>
                {message.timestamp && (
                  <div className="text-xs text-gray-500 px-1">
                    {formatTimestamp(message.timestamp)}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <AnimatePresence>
        {!autoScroll && messages?.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => {
              setAutoScroll(true);
              scrollToBottom();
            }}
            className="absolute bottom-20 right-4 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            Scroll to Bottom
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex-none p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex gap-2">
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
        </form>
      </div>
    </div>
  );
}

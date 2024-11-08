import React, { useState } from 'react';
import { Bot, X, Settings } from 'lucide-react';
import { useBrowserStore } from '../stores/browserStore';
import toast from 'react-hot-toast';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { aiProvider, updateAIProvider } = useBrowserStore();

  const handleAIRequest = async () => {
    if (!prompt.trim()) return;

    try {
      // Mock AI response for demo
      toast.success('AI Assistant is thinking...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = `Here's what I found about "${prompt}":
1. This is a simulated AI response
2. In a real implementation, this would connect to an AI service
3. The response would be based on the current webpage content`;
      
      toast.success('AI response received!');
      setPrompt('');
      
    } catch (error) {
      toast.error('Failed to get AI response');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
      >
        <Bot className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me about the current webpage..."
              className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="text-sm text-gray-400 mb-4">
              Examples:
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Summarize this webpage</li>
                <li>Find key information about...</li>
                <li>Explain this technical concept</li>
                <li>Translate this page to Spanish</li>
              </ul>
            </div>

            <button
              onClick={handleAIRequest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
            >
              Get AI Response
            </button>
          </div>
        </div>
      )}
    </>
  );
}
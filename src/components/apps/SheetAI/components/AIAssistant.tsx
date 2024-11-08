import React, { useState } from 'react';
import { Bot, X, Settings } from 'lucide-react';
import { useSheetStore } from '../stores/sheetStore';
import toast from 'react-hot-toast';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prompt, setPrompt] = useState('');
  const { selectedRange, updateCell } = useSheetStore();

  const handleAIRequest = async () => {
    if (!selectedRange) {
      toast.error('Please select a cell or range first');
      return;
    }

    try {
      // Mock AI response for now
      const response = await mockAIResponse(prompt);
      if (response.type === 'formula') {
        updateCell(selectedRange.start, response.formula);
        toast.success('Formula applied successfully');
      } else if (response.type === 'chart') {
        toast.success('Chart creation coming soon!');
      }
    } catch (error) {
      toast.error('Failed to process AI request');
    }

    setPrompt('');
  };

  const mockAIResponse = async (prompt: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (prompt.toLowerCase().includes('sum')) {
      return {
        type: 'formula',
        formula: '=SUM(A1:A5)',
      };
    } else if (prompt.toLowerCase().includes('chart')) {
      return {
        type: 'chart',
        chartType: 'bar',
        range: 'A1:B5',
      };
    }
    
    return {
      type: 'formula',
      formula: '=ERROR("No matching operation found")',
    };
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showSettings ? (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  AI Model
                </label>
                <select className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="gpt-3.5">GPT-3.5</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="local">Local Model</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter your API key"
                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ) : (
            <div className="p-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask me to help with formulas, charts, or data analysis..."
                className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="text-sm text-gray-400 mb-4">
                Examples:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Calculate the sum of cells A1 to A5</li>
                  <li>Create a bar chart from this data range</li>
                  <li>Analyze trends in this dataset</li>
                </ul>
              </div>

              <button
                onClick={handleAIRequest}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                Get AI Suggestion
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
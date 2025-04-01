import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';

export function ModelManager() {
  const { availableModels, activeModelId, setActiveModel } = useChatStore();

  if (!availableModels || availableModels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mb-2 mx-auto" />
          <p>No models available.</p>
          <p className="text-sm mt-1">Please configure your API key first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="grid gap-4">
        {availableModels.map((model) => {
          const isSelected = model.id === activeModelId;

          return (
            <div
              key={model.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border
                ${isSelected ? 'bg-blue-500/10 border-blue-500/50' : 'border-gray-800 hover:border-gray-700'}
              `}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">{model.name}</h3>
                  {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Provider: {model.provider === 'openai' ? 'OpenAI' : 'Anthropic'}
                </div>
              </div>

              <button
                onClick={() => setActiveModel(model.id)}
                className={`
                  ml-4 px-4 py-2 rounded-lg flex items-center gap-2
                  ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                `}
              >
                {isSelected ? 'Selected' : 'Select'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Download, Loader2, CheckCircle, XCircle } from 'lucide-react';

const AVAILABLE_MODELS = [
  {
    id: 'tinyllama-1.1b',
    name: 'TinyLlama 1.1B',
    description: 'Lightweight model for basic tasks',
    size: '1.1 GB',
    quantized: true
  },
  {
    id: 'phi-2',
    name: 'Phi-2',
    description: 'Microsoft\'s 2.7B parameter model',
    size: '2.7 GB',
    quantized: true
  },
  {
    id: 'mistral-7b',
    name: 'Mistral 7B',
    description: 'High-performance 7B parameter model',
    size: '4.1 GB',
    quantized: true
  }
];

export function ModelSelector({ selectedModel, onSelect, isLoading }) {
  const [downloadProgress, setDownloadProgress] = useState({});

  const handleModelSelect = async (model) => {
    if (isLoading) return;

    try {
      setDownloadProgress(prev => ({ ...prev, [model.id]: 0 }));
      
      // Simulate download progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setDownloadProgress(prev => ({ ...prev, [model.id]: i }));
      }

      onSelect(model);
    } catch (error) {
      console.error('Failed to download model:', error);
    } finally {
      setDownloadProgress(prev => ({ ...prev, [model.id]: null }));
    }
  };

  return (
    <div className="grid gap-2">
      {AVAILABLE_MODELS.map(model => (
        <div
          key={model.id}
          className={`
            flex items-center justify-between p-3 rounded-lg border
            ${selectedModel?.id === model.id
              ? 'bg-blue-500/10 border-blue-500/50'
              : 'border-gray-800 hover:border-gray-700'}
          `}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-white">{model.name}</h3>
              {selectedModel?.id === model.id && (
                <CheckCircle className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <p className="text-sm text-gray-400 truncate">{model.description}</p>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <span>Size: {model.size}</span>
              {model.quantized && <span>Quantized</span>}
            </div>
          </div>

          <button
            onClick={() => handleModelSelect(model)}
            disabled={isLoading || downloadProgress[model.id] !== undefined}
            className={`
              ml-4 px-4 py-2 rounded-lg flex items-center gap-2
              ${selectedModel?.id === model.id
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {downloadProgress[model.id] !== undefined ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{downloadProgress[model.id]}%</span>
              </>
            ) : selectedModel?.id === model.id ? (
              'Selected'
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
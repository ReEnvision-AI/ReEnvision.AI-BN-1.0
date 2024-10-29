import { useState, useEffect } from 'react';
import { 
  Cpu, Play, Settings, Loader2, 
  Save, Download, Upload, RefreshCw,
  ChevronDown, ChevronRight, AlertCircle
} from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { ChatInterface } from './ChatInterface';
import { SettingsPanel } from './SettingsPanel';
import { ResourceMonitor } from './ResourceMonitor';

export function LocalAI() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedModel, setSelectedModel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    maxMemory: 4096,
    threads: navigator.hardwareConcurrency || 4,
    contextSize: 2048,
    streamResponse: true
  });

  const handleModelSelect = async (model) => {
    try {
      setIsLoading(true);
      setError(null);
      // Simulate model loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSelectedModel(model);
    } catch (err) {
      setError('Failed to load model: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-semibold text-white">Local AI</h1>
          </div>
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <ModelSelector
          selectedModel={selectedModel}
          onSelect={handleModelSelect}
          isLoading={isLoading}
        />

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          {activeTab === 'chat' ? (
            <ChatInterface
              selectedModel={selectedModel}
              settings={settings}
            />
          ) : (
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
            />
          )}
        </div>

        <ResourceMonitor settings={settings} />
      </div>
    </div>
  );
}
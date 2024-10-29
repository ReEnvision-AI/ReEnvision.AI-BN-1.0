import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

export function SettingsPanel({ settings, onSettingsChange }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSettingsChange(localSettings);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Model Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Maximum Memory Usage (MB)
          </label>
          <input
            type="number"
            value={localSettings.maxMemory}
            onChange={(e) => setLocalSettings(prev => ({
              ...prev,
              maxMemory: parseInt(e.target.value)
            }))}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Number of Threads
          </label>
          <input
            type="number"
            value={localSettings.threads}
            onChange={(e) => setLocalSettings(prev => ({
              ...prev,
              threads: parseInt(e.target.value)
            }))}
            min={1}
            max={navigator.hardwareConcurrency || 8}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Context Size
          </label>
          <input
            type="number"
            value={localSettings.contextSize}
            onChange={(e) => setLocalSettings(prev => ({
              ...prev,
              contextSize: parseInt(e.target.value)
            }))}
            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="streamResponse"
            checked={localSettings.streamResponse}
            onChange={(e) => setLocalSettings(prev => ({
              ...prev,
              streamResponse: e.target.checked
            }))}
            className="rounded border-gray-700 bg-gray-800 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="streamResponse" className="text-sm text-gray-300">
            Enable response streaming
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
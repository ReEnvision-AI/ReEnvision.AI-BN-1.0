import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useChatyStore } from './stores/chatyStore';

export function Settings({ onClose }) {
  const { apiKey, apiEndpoint, setApiKey, setApiEndpoint } = useChatyStore();
  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [localEndpoint, setLocalEndpoint] = useState(apiEndpoint || 'https://api.openai.com/v1');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Validate API key
      if (!localApiKey && localEndpoint.includes('openai.com')) {
        throw new Error('API key is required for OpenAI');
      }

      // Test API connection
      const response = await fetch(`${localEndpoint}/models`, {
        headers: {
          'Authorization': `Bearer ${localApiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to connect to API');
      }

      setApiKey(localApiKey);
      setApiEndpoint(localEndpoint);
      setSuccess('Settings saved successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white mb-6">API Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your API key"
          />
          <p className="mt-1 text-xs text-gray-400">
            Your API key will be stored securely in your browser
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Endpoint
          </label>
          <input
            type="text"
            value={localEndpoint}
            onChange={(e) => setLocalEndpoint(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter API endpoint"
          />
          <p className="mt-1 text-xs text-gray-400">
            Default: https://api.openai.com/v1
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2"
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
    </div>
  );
}
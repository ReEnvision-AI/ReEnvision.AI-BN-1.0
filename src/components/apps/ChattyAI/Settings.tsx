import React, { useState, useEffect } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';
import { type Provider } from '../../../services/aiService';

export function Settings({ onClose }: { onClose: () => void }) {
  const { apiKey, anthropicKey, apiProvider, baseUrl, setApiKey } = useChatStore();

  const [localApiKey, setLocalApiKey] = useState(apiKey || '');
  const [localAnthropicKey, setLocalAnthropicKey] = useState(anthropicKey || '');
  const [localProvider, setLocalProvider] = useState<Provider>(apiProvider || 'openai');
  const [localBaseUrl, setLocalBaseUrl] = useState(baseUrl || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load saved settings
    const savedConfig = localStorage.getItem('ai_service_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setLocalProvider(config.provider);
      if (config.provider === 'openai') {
        setLocalApiKey(config.apiKey);
      } else if (config.provider === 'anthropic') {
        setLocalAnthropicKey(config.apiKey);
      }
      setLocalBaseUrl(config.baseUrl || '');
    }
  }, []);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Validate based on provider
      if (localProvider === 'custom' && !localBaseUrl) {
        throw new Error('Base URL is required for custom provider');
      }

      const key = localProvider === 'anthropic' ? localAnthropicKey : localApiKey;
      if (!key && localProvider !== 'custom') {
        throw new Error(`API key is required for ${localProvider === 'openai' ? 'OpenAI' : 'Anthropic'}`);
      }

      await setApiKey(key, localProvider, localBaseUrl);
      setSuccess('Settings saved successfully');
      onClose();
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
          <label className="block text-sm font-medium text-gray-300 mb-2">AI Provider</label>
          <select
            value={localProvider}
            onChange={(e) => setLocalProvider(e.target.value as Provider)}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="custom">Custom Provider</option>
          </select>
        </div>

        {localProvider === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Base URL</label>
            <input
              type="url"
              value={localBaseUrl}
              onChange={(e) => setLocalBaseUrl(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter API base URL"
            />
            <p className="mt-1 text-xs text-gray-400">Example: http://localhost:1234/v1</p>
          </div>
        )}

        {localProvider === 'openai' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">OpenAI API Key</label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your OpenAI API key"
            />
            <p className="mt-1 text-xs text-gray-400">Your API key will be stored securely in your browser</p>
          </div>
        )}

        {localProvider === 'anthropic' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Anthropic API Key</label>
            <input
              type="password"
              value={localAnthropicKey}
              onChange={(e) => setLocalAnthropicKey(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Anthropic API key"
            />
            <p className="mt-1 text-xs text-gray-400">Your API key will be stored securely in your browser</p>
          </div>
        )}

        {localProvider === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">API Key (Optional)</label>
            <input
              type="password"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter API key (if required)"
            />
            <p className="mt-1 text-xs text-gray-400">Optional: Only if your custom endpoint requires authentication</p>
          </div>
        )}

        {error && <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">{error}</div>}
        {success && <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">{success}</div>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
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

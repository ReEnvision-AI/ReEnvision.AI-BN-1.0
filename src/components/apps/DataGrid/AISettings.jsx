import { useState } from 'react';
import { Save, Key, Trash2 } from 'lucide-react';

export function AISettings({ onSave, onClose }) {
  const [settings, setSettings] = useState({
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  });

  const [savedKeys, setSavedKeys] = useState(() => {
    const saved = localStorage.getItem('datagrid_ai_keys');
    return saved ? JSON.parse(saved) : [];
  });

  const providers = [
    { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-3.5-turbo'] },
    { id: 'anthropic', name: 'Anthropic', models: ['claude-2', 'claude-instant'] },
    { id: 'google', name: 'Google AI', models: ['gemini-pro'] },
    { id: 'mistral', name: 'Mistral AI', models: ['mistral-medium', 'mistral-small'] }
  ];

  const handleSave = () => {
    const newKey = {
      id: Date.now(),
      name: `${settings.provider} - ${settings.model}`,
      ...settings
    };

    const updatedKeys = [...savedKeys, newKey];
    setSavedKeys(updatedKeys);
    localStorage.setItem('datagrid_ai_keys', JSON.stringify(updatedKeys));
    onSave(settings);
  };

  const handleDelete = (id) => {
    const updatedKeys = savedKeys.filter(key => key.id !== id);
    setSavedKeys(updatedKeys);
    localStorage.setItem('datagrid_ai_keys', JSON.stringify(updatedKeys));
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white mb-6">AI Model Settings</h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            AI Provider
          </label>
          <select
            value={settings.provider}
            onChange={(e) => setSettings({ ...settings, provider: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your API key"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Model
          </label>
          <select
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {providers.find(p => p.id === settings.provider)?.models.map(model => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Temperature
            </label>
            <input
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              min="1"
              max="4000"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {savedKeys.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">Saved API Keys</h3>
            <div className="space-y-2">
              {savedKeys.map(key => (
                <div 
                  key={key.id}
                  className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{key.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(key.id)}
                    className="p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
import { Save } from 'lucide-react';

export function AppConfig({ appName, onAppNameChange }) {
  return (
    <div className="p-4 border-b border-gray-700">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Application Name
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={appName}
          onChange={(e) => onAppNameChange(e.target.value)}
          placeholder="My Application"
          className="flex-1 bg-gray-700/50 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          title="Save Configuration"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
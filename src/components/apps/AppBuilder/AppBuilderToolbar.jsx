import { Save, Upload, Play, Settings } from 'lucide-react';

export function AppBuilderToolbar({ onSave, onPublish }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
      <button
        onClick={onSave}
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        <span>Save</span>
      </button>

      <button
        onClick={onPublish}
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        <span>Publish</span>
      </button>

      <div className="flex-1" />

      <button
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}
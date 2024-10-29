import { Save, Upload, Play, Settings } from 'lucide-react';
import { useProjectStore } from './stores/projectStore';

export function AppBuilderToolbar() {
  const { saveProject } = useProjectStore();

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
      <button
        onClick={saveProject}
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors flex items-center gap-2"
        title="Save project"
      >
        <Save className="w-4 h-4" />
        <span>Save</span>
      </button>

      <button
        onClick={() => {
          // Implement publish to app store
        }}
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors flex items-center gap-2"
        title="Publish to App Store"
      >
        <Upload className="w-4 h-4" />
        <span>Publish</span>
      </button>

      <div className="flex-1" />

      <button
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors"
        title="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}
import React from 'react';
import { Settings, Layout, Eye, Maximize2, Palette } from 'lucide-react';
import { useDesktopStore } from '../../store/useDesktopStore';
import Wheel from '@uiw/react-color-wheel';

export const DesktopManager: React.FC = () => {
  const { settings, updateSettings } = useDesktopStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [hsva, setHsva] = React.useState({ h: 215, s: 60, v: 26, a: 1 });

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ background: e.target.value });
  };

  const handleColorChange = (color: { hex: string }) => {
    updateSettings({ backgroundColor: color.hex });
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ taskbarPosition: e.target.value as any });
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ taskbarOpacity: parseFloat(e.target.value) });
  };

  const handleAutoHideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ taskbarAutoHide: e.target.checked });
  };

  return (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg backdrop-blur-sm
          border border-gray-700/50 text-gray-300 transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm
          border border-gray-700 rounded-lg shadow-xl p-4">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Desktop Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Background
              </label>
              <select
                value={settings.background}
                onChange={(e) => updateSettings({ background: e.target.value })}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm mb-4"
              >
                <option value="solid">Solid Color</option>
                <option value="linear-gradient(to bottom, #0f1c3f, #1a2b4a)">Navy Gradient</option>
                <option value="linear-gradient(to right, #2193b0, #6dd5ed)">Blue Gradient</option>
              </select>
              
              {settings.background === 'solid' && (
                <div className="mt-4 flex flex-col items-center bg-gray-700/50 rounded-lg p-4">
                  <Wheel
                    color={hsva}
                    onChange={(color) => {
                      setHsva(color.hsva);
                      handleColorChange(color);
                    }}
                    width={200}
                    height={200}
                  />
                  <div 
                    className="w-full h-8 mt-4 rounded-lg border border-gray-600"
                    style={{ backgroundColor: settings.backgroundColor }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                Taskbar Position
              </label>
              <select
                value={settings.taskbarPosition}
                onChange={handlePositionChange}
                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm"
              >
                <option value="bottom">Bottom</option>
                <option value="top">Top</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Taskbar Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.taskbarOpacity}
                onChange={handleOpacityChange}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoHide"
                checked={settings.taskbarAutoHide}
                onChange={handleAutoHideChange}
                className="rounded bg-gray-700 border-gray-600"
              />
              <label
                htmlFor="autoHide"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                Auto-hide Taskbar
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
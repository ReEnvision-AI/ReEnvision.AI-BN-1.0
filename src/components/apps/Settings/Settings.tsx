import React, { useState } from 'react';
import { Layout, Eye, Maximize2, Plus, Trash2 } from 'lucide-react';
import { useDesktopStore } from '../../../store/useDesktopStore';
import type { ComponentType, CSSProperties } from 'react';
import type { WindowProps } from '../../../types';
import { useAppStore } from '../../../store/useAppStore'; 

const Settings: ComponentType<WindowProps> = ({ isMobile }) => {
  const { settings, updateSettings, backgrounds, addBackground, removeBackground, updateBackground } = useDesktopStore();
  const { installableApps } = useAppStore();
  
  const mobileStyles: CSSProperties = {
    fontSize: isMobile ? '14px' : undefined,
    padding: isMobile ? '12px' : undefined
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
    <div 
      className="h-full bg-gray-900 text-white overflow-y-auto"
      style={mobileStyles}
    >
      <h2 className="text-2xl font-semibold mb-8">System Settings</h2>
      <div className="space-y-8">
        <section>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Workspaces
          </h3>

          <div className="space-y-4">
            {backgrounds.map((bg) => (
              <div key={bg.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <input
                    type="text"
                    value={bg.name}
                    onChange={(e) => updateBackground(bg.id, { name: e.target.value })}
                    className="bg-gray-700 text-white rounded px-3 py-1 flex-1"
                  />
                  {bg.id !== 'default' && (
                    <button
                      onClick={() => removeBackground(bg.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 min-w-[44px] min-h-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <select
                    value={bg.style}
                    onChange={(e) => updateBackground(bg.id, { style: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 min-h-[120px]"
                  >
                    <option value="linear-gradient(to bottom, #0f1c3f, #1a2b4a)">Navy Gradient</option>
                    <option value="linear-gradient(to right, #2193b0, #6dd5ed)">Blue Gradient</option>
                    <option value="linear-gradient(to bottom right, #000428, #004e92)">Deep Blue</option>
                    <option value="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)">Royal Blue</option>
                    <option value="linear-gradient(135deg, #24243e 0%, #302b63 50%, #0f0c29 100%)">Deep Night</option>
                    <option value="linear-gradient(to right, #141e30, #243b55)">Space Night</option>
                    <option value="linear-gradient(to right, #000000, #434343)">Midnight Gray</option>
                    <option value="linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)">Sunset Vibes</option>
                    <option value="linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)">Purple Mist</option>
                    <option value="linear-gradient(to right, #0f2027, #203a43, #2c5364)">Ocean Deep</option>
                    <option value="linear-gradient(60deg, #29323c 0%, #485563 100%)">Steel Gray</option>
                    <option value="linear-gradient(-225deg, #2CD8D5 0%, #6B8DD6 48%, #8E37D7 100%)">Neon Glow</option>
                    <option value="linear-gradient(-225deg, #AC32E4 0%, #7918F2 48%, #4801FF 100%)">Electric Violet</option>
                    <option value="linear-gradient(45deg, #874da2 0%, #c43a30 100%)">Sunset Purple</option>
                    <option value="linear-gradient(to right, #4b6cb7, #182848)">Deep Ocean</option>
                    <option value="linear-gradient(60deg, #141e30 0%, #243b55 100%)">Dark Ocean</option>
                    <option value="linear-gradient(to right, #0f0c29, #302b63, #24243e)">Starry Night</option>
                  </select>

                  <div 
                    className="w-full h-24 rounded-lg mb-4 transition-all duration-300"
                    style={{ background: bg.style }}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Apps in this workspace
                    </label>
                    <select
                      multiple
                      value={bg.appIds}
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions);
                        updateBackground(bg.id, {
                          appIds: options.map(opt => opt.value)
                        });
                      }}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 min-h-[100px]"
                    >
                      {installableApps.map(app => (
                        <option key={app.id} value={app.id}>{app.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => addBackground({
                name: 'New Workspace',
                style: 'linear-gradient(to bottom, #0f1c3f, #1a2b4a)',
                appIds: []
              })} 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Workspace
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Taskbar Settings
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position
              </label>
              <select
                value={settings.taskbarPosition}
                onChange={handlePositionChange}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-700 min-h-[44px]"
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
                Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.taskbarOpacity}
                onChange={handleOpacityChange}
                className="w-full accent-blue-500"
              />
              <div className="text-sm text-gray-400 mt-1">
                {Math.round(settings.taskbarOpacity * 100)}%
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
              <input
                type="checkbox"
                id="autoHide"
                checked={settings.taskbarAutoHide}
                onChange={handleAutoHideChange}
                className="rounded bg-gray-700 border-gray-600 w-5 h-5"
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
        </section>
      </div>
    </div>
  );
}

export default Settings;

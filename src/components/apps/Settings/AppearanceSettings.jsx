import { useState } from 'react';
import { Sun, Moon, Palette, Grid } from 'lucide-react';

// Add proper export statement
export function AppearanceSettings({ settings, onThemeChange, onWallpaperChange, onIconColorChange, onGridSettingsChange }) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const BACKGROUND_PRESETS = {
    gradients: [
      {
        name: 'Dark Rainbow',
        value: 'linear-gradient(to right bottom, #2D3436, #000428, #004E92, #000428, #2D3436)'
      },
      {
        name: 'Sunset',
        value: 'linear-gradient(to right, #ff416c, #ff4b2b)'
      },
      {
        name: 'Ocean',
        value: 'linear-gradient(to right, #2193b0, #6dd5ed)'
      }
    ],
    solids: [
      { name: 'Dark Gray', value: '#1f2937' },
      { name: 'Navy Blue', value: '#1e3a8a' },
      { name: 'Deep Purple', value: '#4c1d95' }
    ]
  };

  return (
    <div className="settings-grid">
      {/* Theme Settings */}
      <div className="settings-card">
        <h2 className="text-lg font-semibold text-white mb-4">Theme</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onThemeChange('light')}
            className={`
              flex items-center gap-2 p-4 rounded-lg border-2 transition-colors
              ${settings.theme === 'light'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'}
            `}
          >
            <Sun className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300">Light Mode</span>
          </button>

          <button
            onClick={() => onThemeChange('dark')}
            className={`
              flex items-center gap-2 p-4 rounded-lg border-2 transition-colors
              ${settings.theme === 'dark'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 hover:border-gray-600'}
            `}
          >
            <Moon className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300">Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Icon Settings */}
      <div className="settings-card">
        <h2 className="text-lg font-semibold text-white mb-4">Icon Colors</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Palette className="w-5 h-5 text-gray-400" />
            <input
              type="color"
              value={settings.iconColor || '#FFFFFF'}
              onChange={(e) => onIconColorChange(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer bg-transparent"
            />
            <span className="text-sm text-gray-400">Icon Color</span>
          </div>
        </div>
      </div>

      {/* Background Settings */}
      <div className="settings-card">
        <h2 className="text-lg font-semibold text-white mb-4">Background</h2>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400">Gradient Backgrounds</h3>
          <div className="grid grid-cols-2 gap-4">
            {BACKGROUND_PRESETS.gradients.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onWallpaperChange(preset.value)}
                className={`
                  relative p-4 rounded-lg border-2 transition-colors h-32
                  ${settings.wallpaper === preset.value
                    ? 'border-blue-500'
                    : 'border-gray-700 hover:border-gray-600'}
                `}
                style={{
                  background: preset.value
                }}
              >
                <span className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>

          <h3 className="text-sm font-medium text-gray-400 mt-6">Solid Colors</h3>
          <div className="grid grid-cols-3 gap-4">
            {BACKGROUND_PRESETS.solids.map((color) => (
              <button
                key={color.name}
                onClick={() => onWallpaperChange(color.value)}
                className={`
                  p-4 rounded-lg border-2 transition-colors
                  ${settings.wallpaper === color.value
                    ? 'border-blue-500'
                    : 'border-gray-700 hover:border-gray-600'}
                `}
                style={{ backgroundColor: color.value }}
              >
                <span className="text-white text-sm">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Settings */}
      <div className="settings-card">
        <h2 className="text-lg font-semibold text-white mb-4">Desktop Grid</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">Enable Grid</span>
            </div>
            <button
              onClick={() => onGridSettingsChange({ gridEnabled: !settings.gridEnabled })}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${settings.gridEnabled
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-gray-700/50 text-gray-400'}
              `}
            >
              {settings.gridEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {settings.gridEnabled && (
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Grid Spacing</label>
              <input
                type="range"
                min="10"
                max="50"
                value={settings.gridSpacing || 20}
                onChange={(e) => onGridSettingsChange({ gridSpacing: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-sm text-gray-500 text-right">
                {settings.gridSpacing || 20}px
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
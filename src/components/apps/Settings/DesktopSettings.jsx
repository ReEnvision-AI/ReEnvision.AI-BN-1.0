import { useState, useEffect } from 'react';
import { Grid, Maximize2, Palette, Image } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const ICON_SIZES = {
  small: { size: 64, label: 'Compact' },
  medium: { size: 80, label: 'Standard' },
  large: { size: 96, label: 'Large' }
};

const SPACING_PRESETS = {
  compact: 20,
  comfortable: 30,
  spacious: 40
};

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

export function DesktopSettings() {
  /*const { settings, updateSetting } = useApp();
  const [tempSettings, setTempSettings] = useState({
    gridEnabled: settings.gridEnabled ?? true,
    gridSpacing: settings.gridSpacing || SPACING_PRESETS.comfortable,
    iconSize: settings.iconSize || 'medium',
    wallpaper: settings.wallpaper || BACKGROUND_PRESETS.gradients[0].value
  });*/

  // TODO: Update this to use real settings
  const [tempSettings, setTempSettings] = useState({
    gridEnabled: true,
    gridSpacing: SPACING_PRESETS.comfortable,
    iconSize: 'medium',
    wallpaper: BACKGROUND_PRESETS.gradients[0].value
  })

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = 
      tempSettings.gridEnabled !== settings.gridEnabled ||
      tempSettings.gridSpacing !== settings.gridSpacing ||
      tempSettings.iconSize !== settings.iconSize ||
      tempSettings.wallpaper !== settings.wallpaper;
    setHasChanges(changed);
  }, [tempSettings, settings]);


  // TODO: Add this back but with real settings
  /*const handleApplyChanges = () => {
    updateSetting('gridEnabled', tempSettings.gridEnabled);
    updateSetting('gridSpacing', tempSettings.gridSpacing);
    updateSetting('iconSize', tempSettings.iconSize);
    updateSetting('wallpaper', tempSettings.wallpaper);
    setHasChanges(false);
  };*/

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Desktop Layout</h2>
          <p className="text-gray-400 text-sm">
            Customize how your desktop looks and feels
          </p>
        </div>
        <button
          onClick={handleApplyChanges}
          disabled={!hasChanges}
          className={`
            px-4 py-2 rounded-lg font-medium transition-colors
            ${hasChanges
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
          `}
        >
          Apply Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Background Settings */}
        <div>
          <label className="flex items-center gap-2 text-white mb-4">
            <Image className="w-5 h-5" />
            <span className="font-medium">Background</span>
          </label>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400">Gradient Backgrounds</h3>
            <div className="grid grid-cols-2 gap-4">
              {BACKGROUND_PRESETS.gradients.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setTempSettings(prev => ({
                    ...prev,
                    wallpaper: preset.value
                  }))}
                  className={`
                    relative p-4 rounded-lg border-2 transition-colors h-32
                    ${tempSettings.wallpaper === preset.value
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
                  onClick={() => setTempSettings(prev => ({
                    ...prev,
                    wallpaper: color.value
                  }))}
                  className={`
                    p-4 rounded-lg border-2 transition-colors
                    ${tempSettings.wallpaper === color.value
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
        <div>
          <label className="flex items-center gap-2 text-white mb-4">
            <Grid className="w-5 h-5" />
            <span className="font-medium">Grid Alignment</span>
            <div className="flex-1" />
            <button
              onClick={() => setTempSettings(prev => ({ ...prev, gridEnabled: !prev.gridEnabled }))}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${tempSettings.gridEnabled
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-gray-700/50 text-gray-400'}
              `}
            >
              {tempSettings.gridEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(SPACING_PRESETS).map(([preset, value]) => (
              <button
                key={preset}
                onClick={() => setTempSettings(prev => ({ ...prev, gridSpacing: value }))}
                className={`
                  p-3 rounded-lg border-2 transition-colors capitalize
                  ${tempSettings.gridSpacing === value
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'}
                `}
              >
                <span className="text-white">{preset}</span>
                <span className="block text-xs text-gray-400 mt-1">
                  {value}px spacing
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Icon Size Settings */}
        <div>
          <label className="flex items-center gap-2 text-white mb-4">
            <Maximize2 className="w-5 h-5" />
            <span className="font-medium">Icon Size</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(ICON_SIZES).map(([size, { size: px, label }]) => (
              <button
                key={size}
                onClick={() => setTempSettings(prev => ({ ...prev, iconSize: size }))}
                className={`
                  p-3 rounded-lg border-2 transition-colors
                  ${tempSettings.iconSize === size
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'}
                `}
              >
                <span className="text-white">{label}</span>
                <span className="block text-xs text-gray-400 mt-1">
                  {px}px
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
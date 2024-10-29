import { useState, useRef } from 'react';
import { Grid, Maximize2, Palette, Image, Upload, Plus } from 'lucide-react';

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

const ICON_COLORS = {
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
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' }
  ]
};

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

export function AppearanceSettings({ 
  settings, 
  onThemeChange,
  onWallpaperChange,
  onIconColorChange,
  onGridSettingsChange
}) {
  const [tempSettings, setTempSettings] = useState({
    gridEnabled: settings.gridEnabled ?? true,
    gridSpacing: settings.gridSpacing || SPACING_PRESETS.comfortable,
    iconSize: settings.iconSize || 'medium'
  });
  const [customGradient, setCustomGradient] = useState({
    color1: '#000428',
    color2: '#004E92',
    angle: 45
  });
  const [customColor, setCustomColor] = useState('#1f2937');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleIconColorSelect = (type, value) => {
    onIconColorChange({
      type,
      value,
      solid: type === 'solid' ? value : '#ffffff'
    });
  };

  const handleWallpaperUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        onWallpaperChange(`url(${result})`);
        setUploadError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomGradient = () => {
    const gradient = `linear-gradient(${customGradient.angle}deg, ${customGradient.color1}, ${customGradient.color2})`;
    onWallpaperChange(gradient);
  };

  return (
    <div className="space-y-8">
      {/* Background Settings */}
      <div>
        <label className="flex items-center gap-2 text-white mb-4">
          <Image className="w-5 h-5" />
          <span className="font-medium">Background</span>
        </label>

        <div className="space-y-6">
          {/* Gradient Backgrounds */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-4">Gradient Backgrounds</h3>
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

              {/* Custom Gradient Creator */}
              <div className="col-span-2 bg-gray-800 rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-medium text-gray-300">Custom Gradient</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Color 1</label>
                    <input
                      type="color"
                      value={customGradient.color1}
                      onChange={(e) => setCustomGradient(prev => ({
                        ...prev,
                        color1: e.target.value
                      }))}
                      className="w-full h-8 bg-transparent rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Color 2</label>
                    <input
                      type="color"
                      value={customGradient.color2}
                      onChange={(e) => setCustomGradient(prev => ({
                        ...prev,
                        color2: e.target.value
                      }))}
                      className="w-full h-8 bg-transparent rounded cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Angle: {customGradient.angle}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customGradient.angle}
                    onChange={(e) => setCustomGradient(prev => ({
                      ...prev,
                      angle: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={handleCustomGradient}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Apply Custom Gradient
                </button>
              </div>
            </div>
          </div>

          {/* Solid Colors */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-4">Solid Colors</h3>
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

              {/* Custom Color Picker */}
              <div className="col-span-3 bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-12 bg-transparent rounded cursor-pointer"
                  />
                  <button
                    onClick={() => onWallpaperChange(customColor)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Apply Custom Color
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-4">Custom Image</h3>
            <div className="bg-gray-800 rounded-lg p-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8
                  flex flex-col items-center justify-center gap-2
                  cursor-pointer transition-colors
                  ${uploadError ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleWallpaperUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Click to upload an image (max 2MB)
                  </p>
                  {uploadError && (
                    <p className="text-sm text-red-400 mt-2">{uploadError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Icon Color Settings */}
      <div>
        <label className="flex items-center gap-2 text-white mb-4">
          <Palette className="w-5 h-5" />
          <span className="font-medium">Icon Colors</span>
        </label>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-400">Gradient Icons</h3>
          <div className="grid grid-cols-2 gap-4">
            {ICON_COLORS.gradients.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleIconColorSelect('gradient', preset.value)}
                className={`
                  relative p-4 rounded-lg border-2 transition-colors h-16
                  ${settings.iconColor?.value === preset.value
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

          <h3 className="text-sm font-medium text-gray-400 mt-6">Solid Icon Colors</h3>
          <div className="grid grid-cols-3 gap-4">
            {ICON_COLORS.solids.map((color) => (
              <button
                key={color.name}
                onClick={() => handleIconColorSelect('solid', color.value)}
                className={`
                  p-4 rounded-lg border-2 transition-colors
                  ${settings.iconColor?.solid === color.value
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

      {/* Desktop Grid Settings */}
      <div>
        <label className="flex items-center gap-2 text-white mb-4">
          <Grid className="w-5 h-5" />
          <span className="font-medium">Desktop Grid</span>
        </label>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Enable Grid</span>
            <button
              onClick={() => {
                const newSettings = {
                  ...tempSettings,
                  gridEnabled: !tempSettings.gridEnabled
                };
                setTempSettings(newSettings);
                onGridSettingsChange(newSettings);
              }}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${tempSettings.gridEnabled
                  ? 'bg-blue-500/20 text-blue-300'
                  : 'bg-gray-700/50 text-gray-400'}
              `}
            >
              {tempSettings.gridEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {Object.entries(SPACING_PRESETS).map(([preset, value]) => (
              <button
                key={preset}
                onClick={() => {
                  const newSettings = {
                    ...tempSettings,
                    gridSpacing: value
                  };
                  setTempSettings(newSettings);
                  onGridSettingsChange(newSettings);
                }}
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
              onClick={() => {
                const newSettings = {
                  ...tempSettings,
                  iconSize: size
                };
                setTempSettings(newSettings);
                onGridSettingsChange(newSettings);
              }}
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
  );
}
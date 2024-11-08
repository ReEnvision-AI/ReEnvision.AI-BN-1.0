import React, { useState } from 'react';
import { useSheetStore } from '../stores/sheetStore';
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  Type, Palette, Hash
} from 'lucide-react';

const fontFamilies = [
  'Arial',
  'Times New Roman',
  'Helvetica',
  'Courier New',
  'Georgia',
  'Verdana',
  'system-ui',
];

const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

export function Toolbar() {
  const { selectedCell, updateStyle, styles } = useSheetStore();
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentStyle = selectedCell ? styles[selectedCell] || {} : {};

  const handleStyleChange = (property: string, value: any) => {
    if (!selectedCell) return;
    updateStyle(selectedCell, { [property]: value });
  };

  const toggleStyle = (property: string) => {
    if (!selectedCell) return;
    updateStyle(selectedCell, { [property]: !currentStyle[property] });
  };

  const handleAlignment = (alignment: 'left' | 'center' | 'right') => {
    if (!selectedCell) return;
    updateStyle(selectedCell, { align: alignment });
  };

  const colors = [
    'transparent',
    '#ffffff',
    '#f87171',
    '#fbbf24',
    '#34d399',
    '#60a5fa',
    '#a78bfa',
    '#f472b6',
  ];

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
      {/* Font Controls */}
      <div className="relative">
        <select
          value={currentStyle.fontFamily || 'system-ui'}
          onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <select
          value={currentStyle.fontSize || 14}
          onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
          className="bg-gray-700 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      <div className="h-6 w-px bg-gray-700" />

      {/* Text Formatting */}
      <button
        onClick={() => toggleStyle('bold')}
        className={`p-2 rounded-lg ${currentStyle.bold ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
      >
        <Bold className="w-4 h-4 text-white" />
      </button>

      <button
        onClick={() => toggleStyle('italic')}
        className={`p-2 rounded-lg ${currentStyle.italic ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
      >
        <Italic className="w-4 h-4 text-white" />
      </button>

      <button
        onClick={() => toggleStyle('underline')}
        className={`p-2 rounded-lg ${currentStyle.underline ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
      >
        <Underline className="w-4 h-4 text-white" />
      </button>

      <div className="h-6 w-px bg-gray-700" />

      {/* Alignment */}
      <button
        onClick={() => handleAlignment('left')}
        className={`p-2 rounded-lg ${currentStyle.align === 'left' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
      >
        <AlignLeft className="w-4 h-4 text-white" />
      </button>

      <button
        onClick={() => handleAlignment('center')}
        className={`p-2 rounded-lg ${currentStyle.align === 'center' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
      >
        <AlignCenter className="w-4 h-4 text-white" />
      </button>

      <button
        onClick={() => handleAlignment('right')}
        className={`p-2 rounded-lg ${currentStyle.align === 'right' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
      >
        <AlignRight className="w-4 h-4 text-white" />
      </button>

      <div className="h-6 w-px bg-gray-700" />

      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Palette className="w-4 h-4 text-white" />
        </button>

        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 rounded-lg shadow-lg z-50 grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  handleStyleChange('backgroundColor', color);
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded border border-gray-600"
                style={{ 
                  backgroundColor: color,
                  backgroundImage: color === 'transparent' ? 
                    'linear-gradient(45deg, #374151 25%, transparent 25%, transparent 75%, #374151 75%, #374151)' : 
                    'none',
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 4px 4px'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Text Color */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded-lg hover:bg-gray-700"
        >
          <Type className="w-4 h-4 text-white" />
        </button>

        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 rounded-lg shadow-lg z-50 grid grid-cols-4 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  handleStyleChange('textColor', color);
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded border border-gray-600"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
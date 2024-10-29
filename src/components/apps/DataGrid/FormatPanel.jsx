import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Palette,
  DollarSign,
  Percent
} from 'lucide-react';

export function FormatPanel({ onFormat }) {
  const [numberFormat, setNumberFormat] = useState('text');
  const [decimals, setDecimals] = useState(2);
  const [textColor, setTextColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('transparent');

  const handleNumberFormatChange = (format) => {
    setNumberFormat(format);
    onFormat({ numberFormat: format });
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Text Style</label>
        <div className="flex gap-2">
          <button
            onClick={() => onFormat({ bold: true })}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFormat({ italic: true })}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFormat({ underline: true })}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Alignment</label>
        <div className="flex gap-2">
          <button
            onClick={() => onFormat({ align: 'left' })}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFormat({ align: 'center' })}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => onFormat({ align: 'right' })}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Number Format</label>
        <div className="flex gap-2">
          <button
            onClick={() => handleNumberFormatChange('text')}
            className={`p-2 rounded-lg ${
              numberFormat === 'text' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'hover:bg-gray-700 text-gray-400'
            }`}
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNumberFormatChange('currency')}
            className={`p-2 rounded-lg ${
              numberFormat === 'currency' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'hover:bg-gray-700 text-gray-400'
            }`}
          >
            <DollarSign className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleNumberFormatChange('percentage')}
            className={`p-2 rounded-lg ${
              numberFormat === 'percentage' 
                ? 'bg-blue-500/20 text-blue-400' 
                : 'hover:bg-gray-700 text-gray-400'
            }`}
          >
            <Percent className="w-4 h-4" />
          </button>
          {(numberFormat === 'currency' || numberFormat === 'percentage') && (
            <input
              type="number"
              min="0"
              max="10"
              value={decimals}
              onChange={(e) => {
                setDecimals(e.target.value);
                onFormat({ decimals: parseInt(e.target.value) });
              }}
              className="w-16 px-2 py-1 bg-gray-700 rounded text-white"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Colors</label>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-gray-400" />
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                onFormat({ textColor: e.target.value });
              }}
              className="w-8 h-8 bg-transparent rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-gray-400" />
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                setBgColor(e.target.value);
                onFormat({ backgroundColor: e.target.value });
              }}
              className="w-8 h-8 bg-transparent rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import PropTypes from 'prop-type';
import { Sun, Moon } from 'lucide-react';

export function ThemeSettings({ currentTheme, onThemeChange }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Theme Settings</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onThemeChange('light')}
          className={`
            flex items-center gap-2 p-4 rounded-lg border-2 transition-colors
            ${currentTheme === 'light'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-600'}
            text-white
          `}
        >
          <Sun className="w-5 h-5" />
          <span>Light Mode</span>
        </button>

        <button
          onClick={() => onThemeChange('dark')}
          className={`
            flex items-center gap-2 p-4 rounded-lg border-2 transition-colors
            ${currentTheme === 'dark'
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-600'}
            text-white
          `}
        >
          <Moon className="w-5 h-5" />
          <span>Dark Mode</span>
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Choose between light and dark mode for your desktop environment.
      </div>
    </div>
  );
}

ThemeSettings.propTypes = {
  currentTheme: PropTypes.string.isRequired,
  onThemeChange: PropTypes.func.isRequired,
}
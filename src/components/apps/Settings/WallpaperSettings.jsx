import React from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

export function WallpaperSettings({ currentWallpaper, onWallpaperChange }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: files => {
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onWallpaperChange(e.target.result);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  });

  const presetWallpapers = [
    { 
      id: 'rainbow', 
      label: 'Dark Rainbow', 
      url: 'linear-gradient(to right bottom, #2D3436, #000428, #004E92, #000428, #2D3436)'
    },
    { 
      id: 'gradient', 
      label: 'Blue Gradient', 
      url: 'linear-gradient(to bottom right, #4f46e5, #7c3aed)'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Wallpaper Settings</h2>
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Preset Wallpapers</h3>
        <div className="grid grid-cols-2 gap-4">
          {presetWallpapers.map(wallpaper => (
            <button
              key={wallpaper.id}
              onClick={() => onWallpaperChange(wallpaper.url)}
              className={`
                relative p-4 rounded-lg border-2 transition-colors h-32
                ${currentWallpaper === wallpaper.url
                  ? 'border-blue-500'
                  : 'border-gray-700 hover:border-gray-600'}
              `}
              style={{
                background: wallpaper.url
              }}
            >
              <span className="absolute bottom-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded">
                {wallpaper.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-white">Custom Wallpaper</h3>
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center
            cursor-pointer transition-colors
            ${isDragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-600'}
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400 text-center">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports JPG, PNG and GIF files
          </p>
        </div>
      </div>

      {currentWallpaper && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white">Current Wallpaper</h3>
          <div 
            className="w-full h-32 rounded-lg bg-cover bg-center border-2 border-gray-700"
            style={{
              background: currentWallpaper.startsWith('http') 
                ? `url(${currentWallpaper})` 
                : currentWallpaper
            }}
          />
        </div>
      )}
    </div>
  );
}

WallpaperSettings.propTypes = {
  currentWallpaper: PropTypes.string.isRequired,
  onWallpaperChange: PropTypes.func.isRequired
}
import React from 'react';
import PropTypes from 'prop-types';
import { FolderPlus, Upload, RefreshCw } from 'lucide-react';

export function Toolbar({ onCreateFolder, onUpload, onRefresh }) {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    onUpload(files);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800">
      <button
        onClick={onCreateFolder}
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors"
        title="New Folder"
      >
        <FolderPlus className="w-4 h-4" />
      </button>

      <label className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors cursor-pointer">
        <Upload className="w-4 h-4" />
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          multiple
        />
      </label>

      <button
        onClick={onRefresh}
        className="p-2 hover:bg-gray-700 rounded-lg text-gray-200 transition-colors"
        title="Refresh"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
}

Toolbar.propTypes = {
  onCreateFolder: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}
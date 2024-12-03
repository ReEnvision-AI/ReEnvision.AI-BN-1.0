import React from 'react';
import PropTypes from 'prop-types'
import { FileIcon, FolderIcon, Trash2 } from 'lucide-react';

export function FileList({ 
  files, 
  directories, 
  loading, 
  onNavigate, 
  onDelete,
  currentPath 
}) {
  if (loading) {
    return (
      <div className="flex-1 p-4">
        <div className="animate-pulse space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-700/30 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="grid gap-2">
        {directories.map((dir) => (
          <FileListItem
            key={dir.name}
            name={dir.name}
            isDirectory
            size={dir.size}
            modified={dir.modified}
            onClick={() => onNavigate(`${currentPath}/${dir.name}`)}
            onDelete={() => onDelete(`${currentPath}/${dir.name}`)}
          />
        ))}

        {files.map((file) => (
          <FileListItem
            key={file.name}
            name={file.name}
            size={file.size}
            modified={file.modified}
            onClick={() => {}} // Implement file preview/open
            onDelete={() => onDelete(`${currentPath}/${file.name}`)}
          />
        ))}
      </div>
    </div>
  );
}

function FileListItem({ name, isDirectory, size, modified, onClick, onDelete }) {
  const Icon = isDirectory ? FolderIcon : FileIcon;
  const formattedSize = formatSize(size);
  const formattedDate = new Date(modified).toLocaleString();

  return (
    <div className="flex items-center gap-4 p-2 hover:bg-gray-700/30 rounded-lg group">
      <Icon className="w-5 h-5 text-gray-400" />
      
      <button
        className="flex-1 text-left text-gray-200 hover:text-white"
        onClick={onClick}
      >
        {name}
      </button>

      <span className="text-sm text-gray-400 hidden md:block">
        {formattedSize}
      </span>

      <span className="text-sm text-gray-400 hidden lg:block">
        {formattedDate}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

FileList.propTypes = {
  files: PropTypes.array,
  directories: PropTypes.array,
  loading: PropTypes.bool,
  onNavigate: PropTypes.func,
  onDelete: PropTypes.func,
  currentPath: PropTypes.string,
};

FileListItem.propTypes = {
  name: PropTypes.string,
  isDirectory: PropTypes.bool,
  size: PropTypes.number,
  modified: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
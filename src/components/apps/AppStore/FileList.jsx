import React from 'react';
import PropTypes from 'prop-types';
import { FileText, Folder } from 'lucide-react';

export function FileList({ files }) {
  const renderFileTree = (files, indent = 0) => {
    return Object.entries(files).map(([path, file]) => {
      const isDirectory = file.dir;
      const Icon = isDirectory ? Folder : FileText;
      const color = path === 'manifest.json' ? 'text-blue-400' : 'text-gray-400';

      return (
        <div key={path} className="flex items-center gap-2 text-sm" style={{ paddingLeft: `${indent * 16}px` }}>
          <Icon className={`w-4 h-4 ${color}`} />
          <span className={`${color}`}>{path}</span>
        </div>
      );
    });
  };

  return (
    <div className="bg-gray-900/50 rounded-lg p-3 space-y-1 max-h-[200px] overflow-auto">{renderFileTree(files)}</div>
  );
}

FileList.propTypes = {
  files: PropTypes.array,
};

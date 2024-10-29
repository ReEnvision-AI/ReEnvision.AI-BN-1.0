import { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, Folder } from 'lucide-react';

export function FileHierarchy({ files, onFileSelect }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['/frontend', '/backend']));

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTree = (path = '', indent = 0) => {
    const items = [];
    const entries = Object.entries(files);

    entries.forEach(([name, content]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isFolder = typeof content === 'object';
      const isExpanded = expandedFolders.has(fullPath);

      items.push(
        <div
          key={fullPath}
          className="flex items-center gap-1 py-1 px-2 hover:bg-gray-800 cursor-pointer text-sm"
          style={{ paddingLeft: `${indent * 16 + 8}px` }}
          onClick={() => isFolder ? toggleFolder(fullPath) : onFileSelect(fullPath)}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <Folder className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200">{name}</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{name}</span>
            </>
          )}
        </div>
      );

      if (isFolder && isExpanded) {
        items.push(...renderTree(fullPath, indent + 1));
      }
    });

    return items;
  };

  return (
    <div className="text-sm">
      <div className="p-2 text-gray-400 font-medium border-b border-gray-700">
        Project Files
      </div>
      <div className="py-2">{renderTree()}</div>
    </div>
  );
}
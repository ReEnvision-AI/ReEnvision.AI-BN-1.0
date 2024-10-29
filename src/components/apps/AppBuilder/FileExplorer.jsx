import { useState } from 'react';
import { FolderIcon, FileIcon, ChevronRight, ChevronDown } from 'lucide-react';

export function FileExplorer({ files, onFileChange }) {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['/src']));

  const fileTree = buildFileTree(files);

  function buildFileTree(files) {
    const tree = {};
    Object.keys(files).forEach(path => {
      const parts = path.split('/').filter(Boolean);
      let current = tree;
      parts.forEach((part, i) => {
        if (i === parts.length - 1) {
          current[part] = { type: 'file', content: files[path].code };
        } else {
          current[part] = current[part] || { type: 'folder', children: {} };
          current = current[part].children;
        }
      });
    });
    return tree;
  }

  function renderTree(tree, path = '') {
    return Object.entries(tree).map(([name, node]) => {
      const fullPath = `${path}/${name}`;
      
      if (node.type === 'folder') {
        const isExpanded = expandedFolders.has(fullPath);
        return (
          <div key={fullPath}>
            <button
              onClick={() => {
                setExpandedFolders(prev => {
                  const next = new Set(prev);
                  if (next.has(fullPath)) {
                    next.delete(fullPath);
                  } else {
                    next.add(fullPath);
                  }
                  return next;
                });
              }}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-700/50 rounded-lg text-left"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <FolderIcon className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200 text-sm">{name}</span>
            </button>
            {isExpanded && (
              <div className="pl-4">
                {renderTree(node.children, fullPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <button
          key={fullPath}
          onClick={() => onFileChange(fullPath, node.content)}
          className="flex items-center gap-2 w-full p-2 hover:bg-gray-700/50 rounded-lg text-left pl-6"
        >
          <FileIcon className="w-4 h-4 text-gray-400" />
          <span className="text-gray-200 text-sm">{name}</span>
        </button>
      );
    });
  }

  return (
    <div className="flex-1 overflow-auto p-2">
      <div className="text-sm font-medium text-gray-400 mb-2 px-2">
        Project Files
      </div>
      {renderTree(fileTree)}
    </div>
  );
}
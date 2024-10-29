import { useState } from 'react';
import { File, Folder, ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useProjectStore } from './stores/projectStore';

export function ProjectExplorer() {
  const { files, currentFile, setCurrentFile, createFile, deleteFile } = useProjectStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/src']));

  const fileTree = buildFileTree(files);

  function buildFileTree(files: Record<string, string>) {
    const tree: any = {};
    Object.keys(files).forEach(path => {
      const parts = path.split('/').filter(Boolean);
      let current = tree;
      parts.forEach((part, i) => {
        if (i === parts.length - 1) {
          current[part] = { type: 'file', path };
        } else {
          current[part] = current[part] || { type: 'folder', children: {} };
          current = current[part].children;
        }
      });
    });
    return tree;
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      createFile(
        `/src/${fileName}${fileName.endsWith('.tsx') ? '' : '.tsx'}`,
        'export default function Component() {\n  return null;\n}'
      );
    }
  };

  const renderTree = (tree: any, path = '') => {
    return Object.entries(tree).map(([name, node]: [string, any]) => {
      const fullPath = `${path}/${name}`;
      const isExpanded = expandedFolders.has(fullPath);
      
      if (node.type === 'folder') {
        return (
          <div key={fullPath}>
            <button
              onClick={() => toggleFolder(fullPath)}
              className="flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg text-left"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              <Folder className="w-4 h-4 text-blue-400" />
              <span className="text-gray-300 text-sm">{name}</span>
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
        <div
          key={fullPath}
          className={`
            group flex items-center gap-2 w-full p-2 hover:bg-gray-800 rounded-lg
            ${currentFile?.path === node.path ? 'bg-gray-800' : ''}
          `}
        >
          <File className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => setCurrentFile(node.path)}
            className="flex-1 text-left text-gray-300 text-sm"
          >
            {name}
          </button>
          <button
            onClick={() => deleteFile(node.path)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-400">Project Files</h3>
        <button
          onClick={handleCreateFile}
          className="p-1 hover:bg-gray-800 rounded"
          title="Create new file"
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {renderTree(fileTree)}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { FolderIcon, FileIcon, ChevronLeft, ChevronRight, Upload, FolderPlus, Trash2, RefreshCw } from 'lucide-react';
import { FileList } from './FileList';
import { Breadcrumb } from './Breadcrumb';
import { Toolbar } from './Toolbar';
import { useFileSystem } from './useFileSystem';
import { SideBar } from './SideBar';

export function FileManager() {
  const [currentPath, setCurrentPath] = useState('/home/demo');
  const { 
    files, 
    directories,
    loading,
    error,
    createFolder,
    deleteItem,
    uploadFile,
    refresh
  } = useFileSystem(currentPath);

  const handleNavigate = (path) => {
    setCurrentPath(path);
  };

  const handleUpload = async (files) => {
    for (const file of files) {
      await uploadFile(currentPath, file);
    }
    refresh();
  };

  return (
    <div className="flex h-full">
      <SideBar onNavigate={handleNavigate} currentPath={currentPath} />
      
      <div className="flex-1 flex flex-col">
        <Toolbar
          onCreateFolder={() => createFolder(currentPath)}
          onUpload={handleUpload}
          onRefresh={refresh}
        />

        <Breadcrumb path={currentPath} onNavigate={handleNavigate} />

        {error && (
          <div className="m-4 p-4 bg-red-500/20 text-red-200 rounded-lg">
            {error.message}
          </div>
        )}

        <FileList
          files={files}
          directories={directories}
          loading={loading}
          onNavigate={handleNavigate}
          onDelete={deleteItem}
          currentPath={currentPath}
        />
      </div>
    </div>
  );
}
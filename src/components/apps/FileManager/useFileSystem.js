import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';

export function useFileSystem(path) {
  const [files, setFiles] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { files: fsFiles, setFiles: setFsFiles } = useApp();

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate file system operations
      const parts = path.split('/').filter(Boolean);
      let currentDir = fsFiles;
      
      for (const part of parts) {
        currentDir = currentDir[part] || {};
      }

      const items = Object.entries(currentDir).map(([name, content]) => ({
        name,
        size: typeof content === 'string' ? content.length : 0,
        modified: new Date(),
        isDirectory: typeof content === 'object'
      }));

      setFiles(items.filter(item => !item.isDirectory));
      setDirectories(items.filter(item => item.isDirectory));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (path) => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    try {
      // Simulate folder creation
      const newFiles = { ...fsFiles };
      const parts = path.split('/').filter(Boolean);
      let current = newFiles;
      
      for (const part of parts) {
        current = current[part] = current[part] || {};
      }
      
      current[name] = {};
      setFsFiles(newFiles);
      refresh();
    } catch (err) {
      setError(err);
    }
  };

  const deleteItem = async (path) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      // Simulate item deletion
      const newFiles = { ...fsFiles };
      const parts = path.split('/').filter(Boolean);
      const name = parts.pop();
      let current = newFiles;
      
      for (const part of parts) {
        current = current[part];
      }
      
      delete current[name];
      setFsFiles(newFiles);
      refresh();
    } catch (err) {
      setError(err);
    }
  };

  const uploadFile = async (path, file) => {
    try {
      // Simulate file upload
      const newFiles = { ...fsFiles };
      const parts = path.split('/').filter(Boolean);
      let current = newFiles;
      
      for (const part of parts) {
        current = current[part] = current[part] || {};
      }
      
      current[file.name] = await file.text();
      setFsFiles(newFiles);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    refresh();
  }, [path]);

  return {
    files,
    directories,
    loading,
    error,
    createFolder,
    deleteItem,
    uploadFile,
    refresh
  };
}
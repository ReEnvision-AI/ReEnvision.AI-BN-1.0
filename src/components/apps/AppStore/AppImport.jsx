import { useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ImportProgress } from './ImportProgress';
import { FileList } from './FileList';
import toast from 'react-hot-toast';
import JSZip from 'jszip';

export function AppImport({ onClose }) {
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [importProgress, setImportProgress] = useState(0);
  const [importError, setImportError] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [fileList, setFileList] = useState(null);
  //const { installApp } = useApp();
  const { installedApps, setInstalledApps, uninstallApp, installApp, availableApps } = useApp();

  const validateManifest = (manifest) => {
    const requiredFields = [
      'id', 'name', 'description', 'icon', 'component', 
      'category', 'version', 'author', 'canUninstall'
    ];

    const missingFields = requiredFields.filter(field => !manifest[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields in manifest.json: ${missingFields.join(', ')}`);
    }

    const validCategories = ['development', 'productivity', 'utilities', 'system'];
    if (!validCategories.includes(manifest.category)) {
      throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
    }

    return true;
  };

  const importApp = async (file) => {
    try {
      // Start upload
      setCurrentFile(file);
      setImportStatus('uploading');
      setImportProgress(0);
      setImportError(null);
      setFileList(null);

      // Upload simulation
      await new Promise(resolve => setTimeout(resolve, 500));
      setImportProgress(100);

      // Extract zip contents
      setImportStatus('unzipping');
      setImportProgress(0);
      
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      // Create file list for display
      const fileStructure = {};
      Object.keys(contents.files).forEach(path => {
        fileStructure[path] = {
          dir: contents.files[path].dir
        };
      });
      setFileList(fileStructure);
      
      setImportProgress(100);
      
      // Validate package
      setImportStatus('validating');
      setImportProgress(0);

      // Find and validate manifest.json
      let manifestFile = contents.file('manifest.json');
      if (!manifestFile) {
        manifestFile = contents.file('src/manifest.json');
      }
      
      if (!manifestFile) {
        throw new Error('manifest.json not found in package root or src directory');
      }

      setImportProgress(33);

      // Parse and validate manifest
      const manifestContent = await manifestFile.async('string');
      let manifest;
      try {
        manifest = JSON.parse(manifestContent);
      } catch (error) {
        throw new Error('Invalid manifest.json: Failed to parse JSON');
      }

      // Validate manifest structure
      validateManifest(manifest);
      
      setImportProgress(66);

      // Check for required source files
      const sourceFiles = Object.keys(contents.files).filter(path => 
        path.startsWith('src/') && !path.endsWith('/')
      );

      if (sourceFiles.length === 0) {
        throw new Error('No source files found in src directory');
      }

      // Check package size
      const totalSize = Object.values(contents.files).reduce((size, file) => 
        size + (file._data ? file._data.length : 0), 0
      );
      
      if (totalSize > 50 * 1024 * 1024) {
        throw new Error('Package size exceeds 50MB limit');
      }

      setImportProgress(100);

      // Copy files
      setImportStatus('copying');
      setImportProgress(0);
      
      // Create app directory structure
      const appFiles = {};
      const appDir = `/apps/${manifest.id}`;
      let processedSize = 0;

      // Extract all files to the app directory
      await Promise.all(
        Object.keys(contents.files).map(async (path) => {
          const file = contents.files[path];
          if (!file.dir) {
            const content = await file.async('string');
            appFiles[`${appDir}/${path}`] = content;
            processedSize += file._data.length;
            setImportProgress((processedSize / totalSize) * 100);
          }
        })
      );

      // Register app in the system
      setImportStatus('installing');
      setImportProgress(0);

      // Create app registration
      const appRegistration = {
        id: manifest.id,
        name: manifest.name,
        description: manifest.description,
        icon: manifest.icon,
        component: manifest.component,
        category: manifest.category,
        version: manifest.version,
        author: manifest.author,
        canUninstall: manifest.canUninstall,
        width: manifest.width || 800,
        height: manifest.height || 600,
        screenshots: manifest.screenshots || [],
        features: manifest.features || [],
        keywords: manifest.keywords || [],
        requirements: manifest.requirements || {}
      };

      // Install the app
      //await installApp(manifest.id, appRegistration, appFiles);
      // TODO: Update to properly use the install app command
      
      setImportProgress(100);
      setImportStatus('complete');
      
      toast.success(`${manifest.name} installed successfully`);
      setTimeout(onClose, 1000);

    } catch (error) {
      console.error('Import failed:', error);
      setImportError(error.message || 'Failed to import app');
      toast.error(error.message || 'Failed to import app');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.zip')) {
      toast.error('Please upload a valid .zip file');
      return;
    }

    await importApp(file);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await importApp(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-[500px]">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Import Application</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {importStatus ? (
            <>
              <ImportProgress 
                file={currentFile}
                status={importStatus}
                error={importError}
                progress={importProgress}
              />
              {fileList && importStatus === 'validating' && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-white mb-2">Package Contents:</h4>
                  <FileList files={fileList} />
                </div>
              )}
            </>
          ) : (
            <>
              <div 
                className={`
                  border-2 border-dashed rounded-lg p-8
                  flex flex-col items-center justify-center
                  cursor-pointer transition-colors
                  ${isDragging
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600'}
                `}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-300 text-center mb-2">
                  {isDragging ? 'Drop the file here' : 'Drag & drop your app package here'}
                </p>
                <p className="text-sm text-gray-500">
                  or click to select a file
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              <div className="mt-6 bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-gray-400">
                    <p className="font-medium text-gray-300 mb-1">App Package Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>ZIP file containing app source code</li>
                      <li>Valid manifest.json file with required fields:
                        <ul className="list-disc list-inside ml-4 text-gray-500">
                          <li>id, name, description</li>
                          <li>icon (Lucide icon name)</li>
                          <li>component path</li>
                          <li>category</li>
                          <li>canUninstall (boolean)</li>
                        </ul>
                      </li>
                      <li>Source code in /src directory</li>
                      <li>Maximum size: 50MB</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Sandpack } from '@codesandbox/sandpack-react';
import { FileExplorer } from './FileExplorer';
import { AppConfig } from './AppConfig';
import { AppBuilderToolbar } from './AppBuilderToolbar';

const defaultFiles = {
  '/src/App.jsx': `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to My App</h1>
        <p className="text-gray-600">Start building your application!</p>
      </div>
    </div>
  );
}`,
  '/src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  '/src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
  '/package.json': {
    code: JSON.stringify({
      name: 'my-app',
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview'
      },
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.0.3',
        'autoprefixer': '^10.4.16',
        'postcss': '^8.4.31',
        'tailwindcss': '^3.3.3',
        'vite': '^4.4.5'
      }
    }, null, 2)
  }
};

export function AppBuilder() {
  const [files, setFiles] = useState(defaultFiles);
  const [appName, setAppName] = useState('My App');

  const handleFileChange = (path, code) => {
    setFiles(prev => ({
      ...prev,
      [path]: { code }
    }));
  };

  const handleSave = () => {
    // Update package.json with new app name
    const packageJson = JSON.parse(files['/package.json'].code);
    packageJson.name = appName.toLowerCase().replace(/\s+/g, '-');
    
    setFiles(prev => ({
      ...prev,
      '/package.json': {
        code: JSON.stringify(packageJson, null, 2)
      }
    }));
  };

  return (
    <div className="h-full flex flex-col">
      <AppBuilderToolbar onSave={handleSave} />
      
      <div className="flex-1 flex">
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <AppConfig 
            appName={appName}
            onAppNameChange={setAppName}
          />
          <FileExplorer 
            files={files}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="flex-1">
          <Sandpack
            files={files}
            theme="dark"
            template="vite-react"
            customSetup={{
              dependencies: {
                'react': '^18.2.0',
                'react-dom': '^18.2.0',
                '@vitejs/plugin-react': '^4.0.3',
                'autoprefixer': '^10.4.16',
                'postcss': '^8.4.31',
                'tailwindcss': '^3.3.3',
                'vite': '^4.4.5'
              }
            }}
            options={{
              showNavigator: true,
              showTabs: true,
              showLineNumbers: true,
              showInlineErrors: true,
              wrapContent: true,
              editorHeight: '100%',
              classes: {
                'sp-wrapper': 'h-full',
                'sp-layout': 'h-full',
                'sp-stack': 'h-full'
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
import { create } from 'zustand';

const defaultTemplate = {
  files: {
    '/src/App.tsx': `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to AI Dev Studio</h1>
        <p className="text-gray-600">Start building your application!</p>
      </div>
    </div>
  );
}`,
    '/src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    '/src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    '/package.json': JSON.stringify({
      name: 'ai-dev-project',
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
        '@types/react': '^18.2.15',
        '@types/react-dom': '^18.2.7',
        '@vitejs/plugin-react': '^4.0.3',
        'typescript': '^5.0.0',
        'vite': '^4.4.5'
      }
    }, null, 2)
  }
};

export const useProjectStore = create((set, get) => ({
  files: defaultTemplate.files,
  currentFile: null,
  currentProject: null,

  setCurrentFile: (path) => {
    const { files } = get();
    if (files[path]) {
      set({ currentFile: { path, content: files[path] } });
    }
  },

  updateFile: (path, content) => {
    set((state) => ({
      files: { ...state.files, [path]: content }
    }));
  },

  createFile: (path, content) => {
    set((state) => ({
      files: { ...state.files, [path]: content }
    }));
  },

  deleteFile: (path) => {
    set((state) => {
      const files = { ...state.files };
      delete files[path];
      return { files };
    });
  },

  loadProject: (files) => {
    set({ files, currentFile: null });
  },

  saveProject: () => {
    const { files } = get();
    localStorage.setItem('aidev_project', JSON.stringify(files));
  }
}));
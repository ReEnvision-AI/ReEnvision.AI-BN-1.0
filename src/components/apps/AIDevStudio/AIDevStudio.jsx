import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { CodeEditor } from './CodeEditor';
import { AIPromptPanel } from './AIPromptPanel';
import { LivePreview } from './LivePreview';

export function AIDevStudio() {
  const [files, setFiles] = useState({
    '/src/App.jsx': {
      code: `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to AI Dev Studio</h1>
        <p className="text-gray-600">Start building your application!</p>
      </div>
    </div>
  );
}`
    },
    '/src/main.jsx': {
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    '/src/index.css': {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`
    }
  });

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-700">
          <Tabs defaultValue="code" className="h-full flex flex-col">
            <TabsList className="border-b border-gray-700 px-4">
              <TabsTrigger value="code">Code Editor</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>
            <TabsContent value="code" className="flex-1 p-4">
              <CodeEditor files={files} onUpdate={setFiles} />
            </TabsContent>
            <TabsContent value="ai" className="flex-1 p-4">
              <AIPromptPanel onCodeGenerated={(code) => {
                setFiles(prev => ({
                  ...prev,
                  '/src/App.jsx': { code }
                }));
              }} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/2">
          <LivePreview files={files} />
        </div>
      </div>
    </div>
  );
}
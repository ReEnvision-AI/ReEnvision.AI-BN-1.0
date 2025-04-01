import React, { useEffect, useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { ModelManager } from './ModelManager';
import { HelpContent } from './HelpContent';
import { ChatHistory } from './ChatHistory';
import { Settings } from './Settings';
import * as Tabs from '@radix-ui/react-tabs';
import { ResourceMonitor } from './ResourceMonitor';
import { Settings as SettingsIcon } from 'lucide-react';
import { useChatStore } from '../../../store/useChatStore';

const ChattyAI = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { apiKey, apiProvider } = useChatStore();

  useEffect(() => {
    if (!apiKey && !apiProvider) {
      setShowSettings(true);
    }
  }, [apiKey, apiProvider]);

  if (showSettings) {
    return <Settings onClose={() => setShowSettings(false)} />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-none border-b border-gray-800 p-2 flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Chatty AI</h2>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          title="AI Service Settings"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-gray-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-800">
            <h2 className="text-sm font-medium text-gray-400">Chat History</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatHistory />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col min-w-0">
          <Tabs.Root defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
            <Tabs.List className="flex border-b border-gray-800 px-4">
              <Tabs.Trigger 
                value="chat" 
                className="px-4 py-2 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Chat
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="models" 
                className="px-4 py-2 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Models
              </Tabs.Trigger>
              <Tabs.Trigger 
                value="help" 
                className="px-4 py-2 text-gray-400 hover:text-white data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
              >
                Help
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="chat" className="flex-1 overflow-hidden">
              <ChatInterface onOpenSettings={() => setShowSettings(true)} />
            </Tabs.Content>

            <Tabs.Content value="models" className="flex-1 overflow-auto p-4">
              <ModelManager />
            </Tabs.Content>

            <Tabs.Content value="help" className="flex-1 overflow-auto p-4">
              <HelpContent />
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <div className="w-64 border-l border-gray-800 overflow-y-auto">
          <ResourceMonitor />
        </div>
      </div>
    </div>
  );
}

export default ChattyAI;

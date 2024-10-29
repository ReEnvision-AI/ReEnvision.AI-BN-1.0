import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ChatInterface } from './ChatInterface';
import { ModelManager } from './ModelManager';
import { APIEndpoints } from './APIEndpoints';
import { ResourceMonitor } from './ResourceMonitor';
import { useChatyStore } from './stores/chatyStore';

export function ChatyAI() {
  const { initializeChat } = useChatyStore();

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex-1 flex">
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="border-b border-gray-800 px-4">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 p-0">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="models" className="flex-1 p-4 overflow-auto">
              <ModelManager />
            </TabsContent>

            <TabsContent value="api" className="flex-1 p-4 overflow-auto">
              <APIEndpoints />
            </TabsContent>
          </Tabs>
        </div>

        <ResourceMonitor />
      </div>
    </div>
  );
}
import React, { useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { ModelManager } from './ModelManager';
import { APIEndpoints } from './APEndpoints';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ResourceMonitor } from './ResourceMonitor';

// Ensure window stays within bounds
const ChattyAI = () => {
  // Ensure window stays within bounds
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 640;
      if (!isMobile) {
        const windowElement = document.querySelector('.window-drag-handle')?.parentElement;
        if (!windowElement) return;

        const rect = windowElement.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Check if window is outside bounds
        if (rect.right > screenWidth) {
          windowElement.style.transform = `translate(${screenWidth - rect.width - 16}px, ${rect.top}px)`;
        }
        if (rect.bottom > screenHeight) {
          windowElement.style.transform = `translate(${rect.left}px, ${screenHeight - rect.height - 16}px)`;
        }
        if (rect.left < 0) {
          windowElement.style.transform = `translate(16px, ${rect.top}px)`;
        }
        if (rect.top < 0) {
          windowElement.style.transform = `translate(${rect.left}px, 16px)`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

export default ChattyAI;
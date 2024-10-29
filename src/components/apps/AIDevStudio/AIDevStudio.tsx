import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { CodeEditor } from './CodeEditor';
import { AIPromptPanel } from './AIPromptPanel';
import { LivePreview } from './LivePreview';
import { ProjectExplorer } from './ProjectExplorer';
import { useProjectStore } from './stores/projectStore';
import { AppBuilderToolbar } from './AppBuilderToolbar';

export function AIDevStudio() {
  const [activeTab, setActiveTab] = useState('editor');
  const { currentProject } = useProjectStore();

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <AppBuilderToolbar />
      
      <div className="flex-1 flex">
        <div className="w-64 border-r border-gray-800">
          <ProjectExplorer />
        </div>

        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b border-gray-800 px-2">
              <TabsList className="bg-transparent border-b border-gray-800">
                <TabsTrigger value="editor" className="data-[state=active]:bg-gray-800">
                  Editor
                </TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-gray-800">
                  AI Assistant
                </TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-gray-800">
                  Preview
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="editor" className="flex-1 p-0 m-0">
              <CodeEditor />
            </TabsContent>

            <TabsContent value="ai" className="flex-1 p-0 m-0">
              <AIPromptPanel />
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-0 m-0">
              <LivePreview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
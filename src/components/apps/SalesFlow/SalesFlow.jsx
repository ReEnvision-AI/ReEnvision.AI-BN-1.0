import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { Dashboard } from './Dashboard';
import { Contacts } from './Contacts';
import { Pipeline } from './Pipeline';
import { Products } from './Products';

export function SalesFlow() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-gray-800 px-2">
          <TabsList className="bg-transparent border-b border-gray-800">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-800">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-gray-800">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="data-[state=active]:bg-gray-800">
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-gray-800">
              Products
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="flex-1 p-0 m-0">
          <Dashboard />
        </TabsContent>

        <TabsContent value="contacts" className="flex-1 p-0 m-0">
          <Contacts />
        </TabsContent>

        <TabsContent value="pipeline" className="flex-1 p-0 m-0">
          <Pipeline />
        </TabsContent>

        <TabsContent value="products" className="flex-1 p-0 m-0">
          <Products />
        </TabsContent>
      </Tabs>
    </div>
  );
}
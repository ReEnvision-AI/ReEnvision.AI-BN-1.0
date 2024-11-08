import React from 'react';
import { Plus, X } from 'lucide-react';
import { useBrowserStore } from '../stores/browserStore';

export function BrowserTabs() {
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useBrowserStore();

  return (
    <div className="flex items-center border-t border-gray-800 px-2">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            group flex items-center gap-2 px-4 py-2 max-w-[200px]
            border-r border-gray-800 cursor-pointer
            ${tab.id === activeTab?.id ? 'bg-gray-800' : 'hover:bg-gray-800'}
          `}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="truncate text-sm text-gray-300">
            {tab.title || 'New Tab'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTab(tab.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      ))}

      <button
        onClick={() => addTab({ url: '', title: 'New Tab' })}
        className="p-2 hover:bg-gray-800 text-gray-400"
        title="New Tab"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
import React, { useState, useRef } from 'react';
import { Search, ArrowLeft, ArrowRight, RotateCcw, Bot, X, Settings } from 'lucide-react';
import { AIAssistant } from './components/AIAssistant';
import { BrowserTabs } from './components/BrowserTabs';
import { BrowserSettings } from './components/BrowserSettings';
import { useBrowserStore } from './stores/browserStore';
import toast from 'react-hot-toast';

export function AIBrowser() {
  const [showSettings, setShowSettings] = useState(false);
  const [url, setUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { activeTab, updateTab, addTab } = useBrowserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }

    try {
      new URL(finalUrl);
      if (activeTab) {
        updateTab(activeTab.id, { url: finalUrl, title: url });
      } else {
        addTab({ url: finalUrl, title: url });
      }
      setUrl('');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  const handleBack = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.history.back();
    }
  };

  const handleForward = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow?.history.forward();
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Navigation Bar */}
      <div className="border-b border-gray-800">
        <div className="flex items-center gap-2 p-2">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
            title="Refresh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL or search query"
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <BrowserTabs />
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative">
        {activeTab ? (
          <iframe
            ref={iframeRef}
            src={activeTab.url}
            className="w-full h-full border-0"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            title="Browser Content"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Open a new tab to start browsing
          </div>
        )}
      </div>

      {/* AI Assistant */}
      <AIAssistant />

      {/* Settings Modal */}
      {showSettings && (
        <BrowserSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
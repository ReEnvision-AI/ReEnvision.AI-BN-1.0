import { useState } from 'react';
import { Save, Copy, Trash2 } from 'lucide-react';

export function TextPad() {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);

  const handleChange = (e) => {
    setContent(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    // Implement save functionality
    setSaved(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the content?')) {
      setContent('');
      setSaved(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg mb-2">
        <div
          role="button"
          tabIndex={0}
          onClick={handleSave}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          className="p-2 hover:bg-gray-600 rounded-lg text-gray-200 transition-colors cursor-pointer"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={handleCopy}
          onKeyPress={(e) => e.key === 'Enter' && handleCopy()}
          className="p-2 hover:bg-gray-600 rounded-lg text-gray-200 transition-colors cursor-pointer"
          title="Copy to clipboard"
        >
          <Copy className="w-4 h-4" />
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={handleClear}
          onKeyPress={(e) => e.key === 'Enter' && handleClear()}
          className="p-2 hover:bg-gray-600 rounded-lg text-gray-200 transition-colors cursor-pointer"
          title="Clear content"
        >
          <Trash2 className="w-4 h-4" />
        </div>
        <div className="flex-1"></div>
        <span className="text-sm text-gray-400">
          {saved ? 'Saved' : 'Unsaved changes'}
        </span>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 bg-gray-700/30 text-gray-100 p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
        placeholder="Start typing..."
      />
    </div>
  );
}
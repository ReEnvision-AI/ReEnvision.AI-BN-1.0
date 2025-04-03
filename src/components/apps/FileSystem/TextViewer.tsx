import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

interface TextViewerProps {
  content: string;
  fileName: string;
}

export const TextViewer: React.FC<TextViewerProps> = ({ content, fileName }) => {
  const [copied, setCopied] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);

  useEffect(() => {
    // Generate line numbers
    const lines = content.split('\n');
    const numbers = lines.map((_, i) => (i + 1).toString().padStart(3, ' '));
    setLineNumbers(numbers);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="relative h-full">
      <div className="absolute top-2 right-2">
        <button
          onClick={handleCopy}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
      
      <div className="flex h-full overflow-auto font-mono text-sm">
        {/* Line numbers */}
        <div className="px-4 py-2 text-right bg-gray-900/50 text-gray-500 select-none border-r border-gray-700">
          {lineNumbers.map((num, i) => (
            <div key={i}>{num}</div>
          ))}
        </div>
        
        {/* Content */}
        <div className="px-4 py-2 overflow-auto whitespace-pre text-gray-300 flex-1">
          {content}
        </div>
      </div>
    </div>
  );
};

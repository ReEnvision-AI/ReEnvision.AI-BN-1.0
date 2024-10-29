import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useProjectStore } from './stores/projectStore';
import { useAIStore } from './stores/aiStore';

export function AIPromptPanel() {
  const [prompt, setPrompt] = useState('');
  const { generateCode, isGenerating } = useAIStore();
  const { currentFile } = useProjectStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    await generateCode(prompt, currentFile?.path);
    setPrompt('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 overflow-auto space-y-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
          <p className="text-gray-400 text-sm">
            Describe what you want to create, and I'll help you generate the code.
            You can ask for:
          </p>
          <ul className="text-gray-400 text-sm mt-2 space-y-1 list-disc list-inside">
            <li>New React components</li>
            <li>Feature implementations</li>
            <li>Code refactoring</li>
            <li>Bug fixes</li>
            <li>TypeScript type definitions</li>
          </ul>
        </div>

        {/* Example prompts */}
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Example prompts:</p>
          <button
            onClick={() => setPrompt("Create a responsive navigation bar with a logo, links, and a mobile menu")}
            className="block text-sm text-blue-400 hover:text-blue-300 text-left"
          >
            "Create a responsive navigation bar with a logo, links, and a mobile menu"
          </button>
          <button
            onClick={() => setPrompt("Generate a form component with email and password fields, validation, and submit handling")}
            className="block text-sm text-blue-400 hover:text-blue-300 text-left"
          >
            "Generate a form component with email and password fields, validation, and submit handling"
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to create..."
            className="flex-1 bg-gray-800 text-white rounded-lg p-3 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className={`
              px-4 rounded-lg flex items-center justify-center
              ${isGenerating 
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isGenerating ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
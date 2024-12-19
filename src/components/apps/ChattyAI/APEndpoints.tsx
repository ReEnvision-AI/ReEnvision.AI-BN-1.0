import React, { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

export function APIEndpoints() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const baseUrl = window.location.origin;

  const endpoints = [
    {
      method: 'POST',
      path: '/v1/chat/completions',
      description: 'Create chat completion',
      example: {
        model: 'Llama-2-7b-chat',
        messages: [{ role: 'user', content: 'Hello!' }],
        stream: true,
      },
    },
    {
      method: 'GET',
      path: '/v1/models',
      description: 'List available models',
    },
    {
      method: 'POST',
      path: '/v1/embeddings',
      description: 'Create embeddings',
      example: {
        model: 'Llama-2-7b-chat',
        input: 'Hello world',
      },
    },
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(`${baseUrl}${text}`);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-2">API Reference</h2>
        <p className="text-gray-400 text-sm">Chaty_AI provides OpenAI-compatible API endpoints. Base URL: {baseUrl}</p>
      </div>

      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <div key={endpoint.path} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}
                `}
                >
                  {endpoint.method}
                </span>
                <code className="text-gray-300">{endpoint.path}</code>
              </div>
              <button
                onClick={() => handleCopy(endpoint.path)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copiedEndpoint === endpoint.path ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-2">{endpoint.description}</p>
            {endpoint.example && (
              <div className="mt-2">
                <div className="text-xs text-gray-500 mb-1">Example request:</div>
                <pre className="bg-gray-900 p-3 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(endpoint.example, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

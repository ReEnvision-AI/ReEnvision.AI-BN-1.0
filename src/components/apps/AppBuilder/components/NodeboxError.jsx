import { AlertCircle } from 'lucide-react';
import { NodeboxErrorType } from '../services/nodeboxStatus';

const ERROR_MESSAGES = {
  [NodeboxErrorType.TIMEOUT]: 'Connection timed out while initializing the development environment.',
  [NodeboxErrorType.INITIALIZATION]: 'Failed to initialize the development environment.',
  [NodeboxErrorType.RUNTIME]: 'Runtime error in the development environment.',
  [NodeboxErrorType.NETWORK]: 'Network error while connecting to the development environment.'
};

const ERROR_ACTIONS = {
  [NodeboxErrorType.TIMEOUT]: 'Please check your internet connection and try again.',
  [NodeboxErrorType.INITIALIZATION]: 'Try refreshing the page or clearing your browser cache.',
  [NodeboxErrorType.RUNTIME]: 'Please check the console for detailed error messages.',
  [NodeboxErrorType.NETWORK]: 'Please check your internet connection and firewall settings.'
};

export function NodeboxError({ error, onRetry }) {
  const errorType = error?.type || NodeboxErrorType.INITIALIZATION;
  const errorMessage = ERROR_MESSAGES[errorType];
  const errorAction = ERROR_ACTIONS[errorType];

  return (
    <div className="p-6 bg-red-500/10 text-red-300 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <h3 className="font-medium">Development Environment Error</h3>
      </div>
      
      <div className="space-y-2 mb-4">
        <p className="text-sm">{errorMessage}</p>
        <p className="text-sm text-red-400">{errorAction}</p>
        {error?.originalError && (
          <pre className="text-xs bg-red-500/5 p-2 rounded-lg overflow-auto">
            {error.originalError.message}
          </pre>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
        >
          Retry Initialization
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700/75 rounded-lg text-sm transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}
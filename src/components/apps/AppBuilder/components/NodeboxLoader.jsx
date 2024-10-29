import { Loader } from 'lucide-react';

export function NodeboxLoader({ retryCount, maxRetries }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-gray-400">
      <Loader className="w-8 h-8 animate-spin mb-4" />
      <p className="text-sm">
        {retryCount > 0 
          ? `Initializing development environment (Attempt ${retryCount}/${maxRetries})...`
          : 'Initializing development environment...'}
      </p>
      {retryCount > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          This may take a few moments...
        </p>
      )}
    </div>
  );
}
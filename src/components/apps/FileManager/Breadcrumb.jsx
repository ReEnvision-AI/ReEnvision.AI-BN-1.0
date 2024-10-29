import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ path, onNavigate }) {
  const parts = path.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-gray-800/50 text-sm">
      <button
        onClick={() => onNavigate('/')}
        className="text-gray-400 hover:text-white"
      >
        /
      </button>
      
      {parts.map((part, index) => {
        const currentPath = '/' + parts.slice(0, index + 1).join('/');
        
        return (
          <div key={currentPath} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <button
              onClick={() => onNavigate(currentPath)}
              className="text-gray-400 hover:text-white px-1"
            >
              {part}
            </button>
          </div>
        );
      })}
    </div>
  );
}
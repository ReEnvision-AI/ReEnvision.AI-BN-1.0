import { Menu } from 'lucide-react';

export function WindowButton({ window, onClick }) {
  const IconComponent = window.icon || Menu;
  
  return (
    <div 
      className={`
        flex flex-col items-center min-w-[80px] p-2 rounded-lg cursor-pointer
        touch-manipulation transition-colors
        ${window.minimized 
          ? 'bg-white/10 hover:bg-white/20' 
          : 'bg-white/20 hover:bg-white/30'}
      `}
      onClick={onClick}
    >
      <IconComponent className="w-6 h-6 text-white mb-1" />
      <span className="text-white text-xs truncate max-w-[70px]">
        {window.title}
      </span>
    </div>
  );
}
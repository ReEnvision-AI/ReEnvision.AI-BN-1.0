import { Menu } from 'lucide-react';

export function MenuItem({ name, icon: IconComponent = Menu, onClick }) {
  return (
    <div 
      className="flex items-center gap-2 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white w-full text-left touch-manipulation cursor-pointer"
      onClick={onClick}
    >
      <IconComponent className="w-5 h-5 shrink-0" />
      <span className="text-sm truncate">{name}</span>
    </div>
  );
}
import React from 'react';
import { useStore } from '../../store/useWindowStore';
import supabase from '../../services/supabaseService';
import { Menu, Power } from 'lucide-react';
import { TaskbarItem } from './TaskBarItem';

export const Taskbar: React.FC = () => {
  const { windows } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur border-t border-gray-700 safe-area-insets">
      <div className="flex h-full items-center px-2">
        <button
          className="
            p-dynamic hover:bg-white/10 rounded-lg 
            touch-manipulation cursor-pointer 
            min-w-touch min-h-touch 
            flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-white/20
            active:bg-white/20
          "
          aria-label="Open Start Menu"
        >
          <Menu className="w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)] text-white" />
        </button>

        <div
          className="
            flex-1 flex items-center justify-center 
            gap-dynamic px-dynamic 
            overflow-x-auto scrollbar-hide
            scroll-smooth
          "
        >
          {windows.map((window) => (
            <TaskbarItem key={window.id} window={window} />
          ))}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="
            p-dynamic hover:bg-white/10 rounded-lg
            touch-manipulation cursor-pointer
            min-w-touch min-h-touch
            flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-white/20
            active:bg-white/20
          "
          aria-label="Logout"
        >
          <Power className="w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] text-white/50 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import type { App } from '../../types';
import { AppWindow } from 'lucide-react';
import { useStore, Window } from '../../store/useWindowStore';
import { iconMap } from '../utils/iconmap';

interface AppIconProps {
  app: App;
  isMobile: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, isMobile }: { app: App; isMobile: boolean }) => {
  const { windows, isAppOpen, openWindow, updateWindow } = useStore();
  const Icon = iconMap[app.icon as keyof typeof iconMap] ? iconMap[app.icon as keyof typeof iconMap] : AppWindow;

  const handleOpen = () => {
    const existingWindow = windows.find(w => w.app.id === app.id);
    
    if (existingWindow) {
      // If window exists but is minimized, restore it
      if (existingWindow.isMinimized) {
        updateWindow({
          ...existingWindow,
          isMinimized: false
        });
      }
    } else {
      console.log('About to open', app);
      openWindow(app);
    }
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer transition-all group h-[72px]"
      onDoubleClick={handleOpen}
      onClick={handleOpen}
    >
      <div className="p-0.5 rounded-lg group-hover:bg-white/10 transition-colors">
        <Icon className="text-white/90 pointer-events-none drop-shadow-lg" size={40} />
      </div>
      <span
        className={`
          text-white text-center break-words line-clamp-2 max-w-[80px]
          font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.5)]
          px-0.5 text-[11px] leading-tight mt-0.5
          ${isMobile ? 'text-dynamic-sm' : 'text-xs'}
        `}
      >
        {app.name}
      </span>
    </div>
  );
};

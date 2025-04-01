import React from 'react';
import type { App } from '../../types';
import { AppWindow } from 'lucide-react';
import { useStore } from '../../store/useWindowStore';
import { iconMap } from '../utils/iconmap';

interface AppIconProps {
  app: App;
  isMobile: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, isMobile }: { app: App; isMobile: boolean }) => {
  const { isAppOen, openWindow } = useStore();
  const Icon = iconMap[app.icon as keyof typeof iconMap] ? iconMap[app.icon as keyof typeof iconMap] : AppWindow;

  const handleOpen = () => {
    if (!isAppOen(app)) {
      console.log('About to open', app);
      openWindow(app);
    }
  };

  return (
    <div
      className="flex flex-col items-center p-4 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
      onDoubleClick={handleOpen}
    >
      <Icon className="text-white mb-1 pointer-events-none" size={40} />
      <span
        className={`text-white text-center break-words line-clamp-2 truncate max-w-[70px] ${isMobile ? 'text-dynamic-sm' : 'text-xs'}`}
      >
        {app.name}
      </span>
    </div>
  );
};

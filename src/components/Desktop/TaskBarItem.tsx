import React from 'react';
import { useStore } from '../../store/useWindowStore';
import type { Window } from '../../types';
import { iconMap } from '../utils/iconmap';

interface TaskbarItemProps {
  window: Window;
}

export const TaskbarItem: React.FC<TaskbarItemProps> = ({ window }) => {
  const { updateWindow, bringToFront } = useStore();
  const Icon = iconMap[window.app.icon];

  const handleClick = () => {
    if (window.isMinimized) {
      updateWindow({ ...window, isMinimized: false });
    }
    bringToFront(window.id);
  };

  return (
    <div
      className={`
      flex flex-col items-center min-w-[80px] p-2 rounded-lg cursor-pointer
      touch-manipulation transition-colors hover-centered
      ${window.isMinimized ? 'bg-white/10' : 'bg-white/20'}
    `}
      onClick={handleClick}
    >
      <Icon className="w-6 h-6 text-white mb-1" />
      <span className="text-white text-xs truncate max-w-[70px]">{window.app.name}</span>
    </div>
  );
};

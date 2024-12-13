import React from 'react';
import { useStore } from '../../store/useStore';
import type { Window } from '../../types';

interface TaskbarItemProps {
  window: Window;
}

export const TaskbarItem: React.FC<TaskbarItemProps> = ({ window }) => {
  const { updateWindow, bringToFront } = useStore();

  const handleClick = () => {
    if (window.isMinimized) {
      updateWindow({ ...window, isMinimized: false });
    }
    bringToFront(window.id);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors ${
        !window.isMinimized ? 'bg-white/10' : ''
      }`}
    >
      <span>{window.app.name}</span>
    </button>
  );
};
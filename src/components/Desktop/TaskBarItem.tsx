import React, { useState } from 'react';
import { useStore } from '../../store/useWindowStore';
import type { Window } from '../../types';
import { iconMap } from '../utils/iconmap';

interface TaskbarItemProps {
  window: Window;
}

export const TaskbarItem: React.FC<TaskbarItemProps> = ({ window }) => {
  const { updateWindow, bringToFront } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
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
      relative p-2 rounded-lg cursor-pointer
      touch-manipulation transition-all duration-150
      ${window.isMinimized ? 'bg-white/10 hover:bg-white/15' : 'bg-white/20 hover:bg-white/25'}
      ${isPressed ? 'scale-95' : isHovered ? 'scale-105' : 'scale-100'}
      ${window.isMinimized ? 'opacity-75' : 'opacity-100'}
    `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <Icon className="w-5 h-5 text-white shrink-0" />
      {window.isMinimized && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
      )}
    </div>
  );
};

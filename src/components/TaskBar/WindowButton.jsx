import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'lucide-react';

export function WindowButton({ window, onClick }) {
  const Icon = window.icon || Menu;
  
  return (
    <div 
      className={`
        flex flex-col items-center min-w-[80px] p-2 rounded-lg cursor-pointer
        touch-manipulation transition-colors hover-centered
        ${window.minimized 
          ? 'bg-white/10' 
          : 'bg-white/20'}
      `}
      onClick={onClick}
    >
      <Icon className="w-6 h-6 text-white mb-1" />
      <span className="text-white text-xs truncate max-w-[70px]">
        {window.title}
      </span>
    </div>
  );
}

WindowButton.propTypes = {
  window: PropTypes.object,
  onClick: PropTypes.func,
};
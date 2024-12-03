import React, { useState, useCallback, useRef } from 'react';
import { Rnd } from 'react-rnd';
import PropTypes from 'prop-types';

export function DesktopIcon({ app, size, position, onMove, onOpen, onContextMenu, gridSize, isSystem }) {
  const [isDragging, setIsDragging] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const touchTimeout = useRef(null);
  
  const DOUBLE_TAP_DELAY = 300;
  const TAP_MOVEMENT_THRESHOLD = 10;
  const LONG_PRESS_DELAY = 500;

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };

    touchTimeout.current = setTimeout(() => {
      if (!isDragging) {
        onContextMenu(e, app);
      }
    }, LONG_PRESS_DELAY);
  }, [app, isDragging, onContextMenu]);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    const moveX = Math.abs(touch.clientX - touchStartPos.current.x);
    const moveY = Math.abs(touch.clientY - touchStartPos.current.y);

    if (moveX > TAP_MOVEMENT_THRESHOLD || moveY > TAP_MOVEMENT_THRESHOLD) {
      clearTimeout(touchTimeout.current);
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    clearTimeout(touchTimeout.current);

    if (isDragging) return;

    const touch = e.changedTouches[0];
    const moveX = Math.abs(touch.clientX - touchStartPos.current.x);
    const moveY = Math.abs(touch.clientY - touchStartPos.current.y);

    if (moveX < TAP_MOVEMENT_THRESHOLD && moveY < TAP_MOVEMENT_THRESHOLD) {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTapTime;

      if (timeDiff < DOUBLE_TAP_DELAY) {
        onOpen();
        setLastTapTime(0);
      } else {
        setLastTapTime(currentTime);
      }
    }
  }, [isDragging, lastTapTime, onOpen]);

  const Icon = app.icon;
  const iconSize = Math.max(24, Math.min(48, size * 0.5));
  const fontSize = Math.max(12, size * 0.14);

  return (
    <Rnd
      default={{
        x: position.x,
        y: position.y,
        width: size,
        height: size * 1.2
      }}
      size={{ width: size, height: size * 1.2 }}
      position={position}
      minWidth={size}
      minHeight={size * 1.2}
      dragGrid={[gridSize, gridSize]}
      bounds="parent"
      enableResizing={false}
      onDragStart={() => setIsDragging(true)}
      onDragStop={(e, d) => {
        setIsDragging(false);
        onMove({ x: d.x, y: d.y });
      }}
      onContextMenu={(e) => onContextMenu(e, app)}
      className={`
        desktop-icon
        ${isSystem ? 'pointer-events-none opacity-75' : ''}
      `}
    >
      <div
        role="button"
        tabIndex={0}
        onDoubleClick={onOpen}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`
          flex flex-col items-center justify-center w-full h-full
          rounded-lg select-none cursor-pointer p-2
          ${!isDragging && 'hover:bg-white/10 active:bg-white/20'}
          transition-colors duration-75
          touch-none
        `}
      >
        <Icon 
          className="text-white mb-2 pointer-events-none" 
          style={{ width: iconSize, height: iconSize }}
        />
        <span 
          className="text-white text-center break-words line-clamp-2 px-1 pointer-events-none"
          style={{ fontSize }}
        >
          {app.name}
        </span>
      </div>
    </Rnd>
  );
}

DesktopIcon.propTypes = {
  app: PropTypes.object,
  size: PropTypes.number,
  position: PropTypes.object,
  onMove: PropTypes.func,
  onOpen: PropTypes.func,
  onContextMenu: PropTypes.func,
  gridSize: PropTypes.number,
  isSystem: PropTypes.bool,
};
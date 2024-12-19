import React, { useCallback } from 'react';
import { Rnd, RndDragEvent } from 'react-rnd';
import { ChevronDown, Minus, Square, X } from 'lucide-react';
import { useStore } from '../../store/useWindowStore';
import type { Window as WindowType } from '../../types';
import { Suspense } from 'react';

interface WindowProps {
  window: WindowType;
  isMobile: boolean;
}

export const Window: React.FC<WindowProps> = ({ window, isMobile }) => {
  const { closeWindow, updateWindow, bringToFront } = useStore();

  const handleDragStop = (_e: RndDragEvent, d: { x: number; y: number }) => {
    updateWindow({
      ...window,
      position: { x: d.x, y: d.y },
    });
  };

  const handleResize = (
    _e: MouseEvent | TouchEvent,
    _direction: string,
    ref: HTMLElement,
    _delta: { width: number; height: number },
    position: { x: number; y: number },
  ) => {
    updateWindow({
      ...window,
      size: {
        width: ref.style.width,
        height: ref.style.height,
      },
      position,
    });
  };

  const toggleMaximize = useCallback(() => {
    updateWindow({
      ...window,
      isMaximized: !window.isMaximized,
      position: !window.isMaximized ? { x: 0, y: 0 } : { x: 50, y: 50 },
      size: !window.isMaximized
        ? { width: '100%', height: '100%' }
        : {
            width: window.app.preferred_width || 800,
            height: window.app.preferred_height || 600,
          },
    });
  }, [window, updateWindow]);

  const toggleMinimize = useCallback(() => {
    updateWindow({
      ...window,
      isMinimized: !window.isMinimized,
    });
  }, [window, updateWindow]);

  const handleClose = useCallback(() => {
    closeWindow(window.id);
  }, [window.id, closeWindow]);

  const Component = window.app.component as React.ElementType;

  // Set default position for mobile
  React.useEffect(() => {
    if (isMobile && !window.isMaximized) {
      toggleMaximize();
    }
  }, [isMobile, window.isMaximized, toggleMaximize]);

  return (
    <Rnd
      style={{
        zIndex: window.zIndex,
        display: window.isMinimized ? 'none' : 'block',
      }}
      default={{
        x: window.position.x,
        y: window.position.y,
        width: window.size.width,
        height: window.size.height,
      }}
      position={window.position}
      size={{
        width: window.size.width,
        height: window.size.height,
      }}
      enableResizing={!window.isMaximized && !isMobile}
      disableDragging={isMobile || window.isMaximized}
      minWidth={isMobile ? '100%' : window.app.min_width || 400}
      minHeight={isMobile ? '100%' : window.app.min_height || 300}
      bounds="parent"
      onDragStop={handleDragStop}
      onResize={handleResize}
      onMouseDown={() => bringToFront(window.id)}
      onTouchStart={() => bringToFront(window.id)}
      dragHandleClassName="window-handle"
    >
      <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between h-12 px-4 bg-gray-900 rounded-t-lg">
          {/* Window Title */}
          <div className="window-handle flex-1 text-white font-medium truncate cursor-move">{window.app.name}</div>

          {/* Window Controls */}
          <div className="flex items-center gap-1">
            {isMobile ? (
              <>
                <button
                  type="button"
                  className="p-3 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors"
                  onClick={toggleMinimize}
                >
                  <ChevronDown className="w-6 h-6 text-gray-300" />
                </button>
                <button
                  type="button"
                  className="p-3 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-colors"
                  onClick={handleClose}
                >
                  <X className="w-6 h-6 text-gray-300" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors"
                  onClick={toggleMinimize}
                >
                  <Minus className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors"
                  onClick={toggleMaximize}
                >
                  <Square className="w-4 h-4 text-gray-300" />
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-colors"
                  onClick={handleClose}
                >
                  <X className="w-4 h-4 text-gray-300" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Window Content */}
        <div
          className={`
            flex-1 overflow-auto overscroll-contain
            ${isMobile ? 'p-2' : 'p-4'}
          `}
        >
          {window.app.url && (
            <iframe
              src={window.app.url}
              className="w-full h-full border-0"
              title={window.app.name}
              referrerPolicy="no-referrer"
            />
          )}
          {window.app.type === 'component' && (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="text-white">Loading...</div>
                </div>
              }
            >
              <Component />
            </Suspense>
          )}
        </div>
      </div>
    </Rnd>
  );
};

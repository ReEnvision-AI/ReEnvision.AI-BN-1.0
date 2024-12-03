import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { X, Minus, Square, ChevronDown } from 'lucide-react';

export function WindowManager({ windows, setWindows }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [activeWindow, setActiveWindow] = useState(null);
  const [windowStates, setWindowStates] = useState({});
  const touchStartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setWindowStates(prev => {
      const newStates = { ...prev };
      delete newStates[id];
      return newStates;
    });
  };

  const minimizeWindow = (id) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ));
  };

  const maximizeWindow = (id) => {
    setWindowStates(prev => {
      const currentState = prev[id] || {};
      const isMaximized = currentState.isMaximized || false;

      if (!isMaximized) {
        // Save current position and size before maximizing
        const window = windows.find(w => w.id === id);
        return {
          ...prev,
          [id]: {
            isMaximized: true,
            prevSize: {
              width: window.width || 600,
              height: window.height || 400
            },
            prevPosition: {
              x: window.x || 0,
              y: window.y || 0
            }
          }
        };
      } else {
        // Restore previous position and size
        return {
          ...prev,
          [id]: {
            ...currentState,
            isMaximized: false
          }
        };
      }
    });
  };

  const bringToFront = (id) => {
    setActiveWindow(id);
    setWindows(prev => {
      const window = prev.find(w => w.id === id);
      const others = prev.filter(w => w.id !== id);
      return [...others, window];
    });
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      y: touch.clientY,
      time: Date.now()
    };
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    const element = e.currentTarget;

    // Apply rubber band effect
    const damping = 0.3;
    const transform = `translateY(${deltaY * damping}px)`;
    element.style.transform = transform;
  };

  const handleTouchEnd = (e, windowId) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(deltaY / deltaTime);

    const element = e.currentTarget;
    element.style.transform = '';

    // Handle swipe gestures
    if (Math.abs(deltaY) > 100 && velocity > 0.3) {
      if (deltaY > 0) {
        minimizeWindow(windowId);
      } else {
        maximizeWindow(windowId);
      }
    }

    touchStartRef.current = null;
  };

  const handleControlClick = (e, handler) => {
    e.stopPropagation();
    handler();
  };

  return (
    <>
      {windows.map(window => {
        if (window.minimized) return null;

        const windowState = windowStates[window.id] || {};
        const isMaximized = isMobile || windowState.isMaximized;
        const zIndex = window.id === activeWindow ? 50 : 10;

        // Calculate window dimensions based on screen size
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const defaultWidth = Math.min(window.width || 600, screenWidth * 0.9);
        const defaultHeight = Math.min(window.height || 400, screenHeight * 0.9);

        const position = isMaximized 
          ? { x: 0, y: 0 }
          : windowState.prevPosition || { 
              x: window.x || (screenWidth - defaultWidth) / 2,
              y: window.y || (screenHeight - defaultHeight) / 2
            };

        const size = isMaximized
          ? { width: '100%', height: '100%' }
          : windowState.prevSize || {
              width: defaultWidth,
              height: defaultHeight
            };

        return (
          <Rnd
            key={window.id}
            position={position}
            size={size}
            style={{ zIndex }}
            minWidth={300}
            minHeight={200}
            bounds="parent"
            dragHandleClassName="window-drag-handle"
            enableResizing={!isMaximized}
            disableDragging={isMaximized}
            onDragStart={() => bringToFront(window.id)}
            onDragStop={(e, d) => {
              setWindows(prev => prev.map(w =>
                w.id === window.id ? { ...w, x: d.x, y: d.y } : w
              ));
            }}
          >
            <div 
              className={`
                flex flex-col h-full bg-gray-800 rounded-lg shadow-xl border border-gray-700
                ${window.id === activeWindow ? 'ring-2 ring-blue-500/50' : ''}
              `}
              onClick={() => bringToFront(window.id)}
            >
              <div 
                className="window-drag-handle flex items-center h-12 px-4 bg-gray-900 rounded-t-lg select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e, window.id)}
              >
                <div className="flex-1 text-white font-medium truncate">
                  {window.title}
                </div>
                <div className="flex items-center gap-1">
                  {isMobile ? (
                    <button
                      onClick={(e) => handleControlClick(e, () => minimizeWindow(window.id))}
                      className="relative flex items-center justify-center w-12 h-12 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors group touch-manipulation"
                      aria-label="Minimize"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleControlClick(e, () => minimizeWindow(window.id))}
                        className="relative flex items-center justify-center w-10 h-10 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors group touch-manipulation"
                        aria-label="Minimize"
                      >
                        <Minus className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                      </button>
                      <button
                        onClick={(e) => handleControlClick(e, () => maximizeWindow(window.id))}
                        className="relative flex items-center justify-center w-10 h-10 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors group touch-manipulation"
                        aria-label="Maximize"
                      >
                        <Square className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={(e) => handleControlClick(e, () => closeWindow(window.id))}
                    className={`
                      relative flex items-center justify-center
                      ${isMobile ? 'w-12 h-12' : 'w-10 h-10'}
                      hover:bg-red-500/20 active:bg-red-500/30
                      rounded-lg transition-colors group touch-manipulation
                    `}
                    aria-label="Close"
                  >
                    <X className={`
                      text-gray-300 group-hover:text-red-400 transition-colors
                      ${isMobile ? 'w-6 h-6' : 'w-4 h-4'}
                    `} />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto scroll-rubber-band">
                {window.content}
              </div>
            </div>
          </Rnd>
        );
      })}
    </>
  );
}

WindowManager.propTypes = {
  windows: PropTypes.array,
  setWindows: PropTypes.func,
};
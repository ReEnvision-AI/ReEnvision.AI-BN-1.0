import { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square, ChevronDown } from 'lucide-react';

export function WindowManager({ windows, setWindows }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [activeWindow, setActiveWindow] = useState(null);
  const lastTapRef = useRef({ time: 0, id: null });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
      
      // Auto-resize windows when screen size changes
      setWindows(prev => prev.map(window => {
        const maxWidth = Math.min(window.width || 600, window.innerWidth * 0.95);
        const maxHeight = Math.min(window.height || 400, (window.innerHeight - 64) * 0.95);
        
        return {
          ...window,
          width: maxWidth,
          height: maxHeight,
          x: Math.max(0, Math.min(window.x || 0, window.innerWidth - maxWidth)),
          y: Math.max(0, Math.min(window.y || 0, window.innerHeight - maxHeight - 64))
        };
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setWindows]);

  const handleTitleBarTap = (windowId) => {
    const now = Date.now();
    const lastTap = lastTapRef.current;

    // Check for double tap (within 300ms)
    if (lastTap.id === windowId && now - lastTap.time < 300) {
      const window = windows.find(w => w.id === windowId);
      if (window) {
        if (window.maximized) {
          minimizeWindow(windowId);
        } else {
          maximizeWindow(windowId);
        }
      }
    }

    lastTapRef.current = { time: now, id: windowId };
  };

  const closeWindow = (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeWindow = (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ));
  };

  const maximizeWindow = (id, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setWindows(prev => prev.map(w =>
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ));
  };

  const bringToFront = (id) => {
    setActiveWindow(id);
    setWindows(prev => {
      const window = prev.find(w => w.id === id);
      const others = prev.filter(w => w.id !== id);
      return [...others, window];
    });
  };

  return (
    <>
      {windows.map(window => {
        if (window.minimized) return null;

        const isMaximized = isMobile || window.maximized;
        const zIndex = window.id === activeWindow ? 50 : 10;

        return (
          <Rnd
            key={window.id}
            default={{
              x: window.x || 10,
              y: window.y || 10,
              width: window.width || '80%',
              height: window.height || '60%'
            }}
            position={isMaximized ? { x: 0, y: 0 } : undefined}
            size={isMaximized ? 
              { width: '100%', height: `calc(100% - 64px)` } : 
              { width: window.width, height: window.height }
            }
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
                onTouchStart={() => handleTitleBarTap(window.id)}
              >
                <div className="flex-1 text-white font-medium truncate">
                  {window.title}
                </div>
                <div className="flex items-center gap-1">
                  {isMobile ? (
                    <button
                      onTouchStart={(e) => minimizeWindow(window.id, e)}
                      onClick={(e) => minimizeWindow(window.id, e)}
                      className="p-3 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors touch-manipulation"
                      aria-label="Minimize"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-300" />
                    </button>
                  ) : (
                    <>
                      <button
                        onTouchStart={(e) => minimizeWindow(window.id, e)}
                        onClick={(e) => minimizeWindow(window.id, e)}
                        className="p-2 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors touch-manipulation"
                        aria-label="Minimize"
                      >
                        <Minus className="w-4 h-4 text-gray-300" />
                      </button>
                      <button
                        onTouchStart={(e) => maximizeWindow(window.id, e)}
                        onClick={(e) => maximizeWindow(window.id, e)}
                        className="p-2 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors touch-manipulation"
                        aria-label="Maximize"
                      >
                        <Square className="w-4 h-4 text-gray-300" />
                      </button>
                    </>
                  )}
                  <button
                    onTouchStart={(e) => closeWindow(window.id, e)}
                    onClick={(e) => closeWindow(window.id, e)}
                    className="p-2 hover:bg-red-500/20 active:bg-red-500/30 rounded-lg transition-colors touch-manipulation"
                    aria-label="Close"
                  >
                    <X className={`w-${isMobile ? '6' : '4'} h-${isMobile ? '6' : '4'} text-gray-300`} />
                  </button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto scroll-momentum">
                {window.content}
              </div>
            </div>
          </Rnd>
        );
      })}
    </>
  );
}
import React, { useCallback } from 'react';
import { Rnd, RndDragEvent } from 'react-rnd';
import { ChevronDown, Minus, Square, X, Maximize2 } from 'lucide-react';
import { useStore } from '../../store/useWindowStore';
import { useDesktopStore } from '../../store/useDesktopStore';
import type { Window as WindowType } from '../../types';
import { IframeWithAuth } from './IframeWithAuth'; 
import { Suspense } from 'react';

interface WindowProps {
  windowData: WindowType;
  isMobile: boolean;
  loading: boolean;
}

export const Window: React.FC<WindowProps> = ({ windowData, isMobile, loading = false }) => {
  const { closeWindow, updateWindow, bringToFront, snapToGrid } = useStore();
  const { settings } = useDesktopStore();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const positionUpdateRef = React.useRef<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const windowRef = React.useRef<HTMLDivElement>(null);

  const [bounds, setBounds] = React.useState(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const taskbarSize = settings.taskbarSize;
    
    return {
      left: settings.taskbarPosition === 'left' ? taskbarSize : 0,
      top: settings.taskbarPosition === 'top' ? taskbarSize : 0,
      right: settings.taskbarPosition === 'right' ? width - taskbarSize : width,
      bottom: settings.taskbarPosition === 'bottom' ? height - taskbarSize : height
    };
  });

  // Update bounds when window size or taskbar position changes
  React.useEffect(() => {
    const updateBounds = () => {
      if (positionUpdateRef.current) {
        clearTimeout(positionUpdateRef.current);
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const taskbarSize = settings.taskbarSize;
      
      const newBounds = {
        left: settings.taskbarPosition === 'left' ? taskbarSize : 0,
        top: settings.taskbarPosition === 'top' ? taskbarSize : 0,
        right: settings.taskbarPosition === 'right' ? width - taskbarSize : width,
        bottom: settings.taskbarPosition === 'bottom' ? height - taskbarSize : height
      };

      setBounds(newBounds);
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => {
      window.removeEventListener('resize', updateBounds);
      if (positionUpdateRef.current) {
        clearTimeout(positionUpdateRef.current);
      }
    };
  }, [settings.taskbarPosition, settings.taskbarSize]);

  const handleDragStop = (_e: RndDragEvent, d: { x: number; y: number }) => {
    // Get current window dimensions
    const width = typeof windowData.size.width === 'string' ? parseInt(windowData.size.width) : windowData.size.width;
    const height = typeof windowData.size.height === 'string' ? parseInt(windowData.size.height) : windowData.size.height;

    // Calculate maximum allowed positions
    const maxX = bounds.right - width;
    const maxY = bounds.bottom - height;

    // Ensure position stays within bounds
    const x = Math.max(bounds.left, Math.min(d.x, maxX));
    const y = Math.max(bounds.top, Math.min(d.y, maxY));

    updateWindow({
      ...windowData,
      position: { x, y },
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
      ...windowData,
      size: {
        width: ref.style.width,
        height: ref.style.height,
      },
      position,
    });
  };

  const toggleMaximize = useCallback(() => {
    const maxWidth = bounds.right - bounds.left;
    const maxHeight = bounds.bottom - bounds.top;

    updateWindow({
      ...windowData,
      isMaximized: !windowData.isMaximized,
      position: !windowData.isMaximized ? { x: 0, y: 0 } : { x: 50, y: 50 },
      size: !windowData.isMaximized
        ? { width: `${maxWidth}px`, height: `${maxHeight}px` }
        : {
            width: windowData.app.preferred_width || 800,
            height: windowData.app.preferred_height || 600,
          },
    });
  }, [windowData, updateWindow, bounds]);

  const toggleMinimize = useCallback(() => {
    updateWindow({
      ...windowData,
      isMinimized: !windowData.isMinimized,
    });
  }, [windowData, updateWindow]);

  const handleClose = useCallback(() => {
    closeWindow(windowData.id);
  }, [windowData.id, closeWindow]);

  const toggleFullscreen = useCallback(async () => {
    if (!windowRef.current) return;
    
    // For mobile, use the documentElement instead of the window element
    const element = isMobile ? document.documentElement : windowRef.current;
    
    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }, []);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const Component = windowData.app.component as React.ElementType;

  // Set default position for mobile
  React.useEffect(() => {
    if (isMobile && !windowData.isMaximized) {
      toggleMaximize();
    }
  }, [isMobile, windowData.isMaximized, toggleMaximize]);

  return (
    <Rnd
      style={{
        zIndex: windowData.zIndex + 100,
        display: windowData.isMinimized ? 'none' : 'block',
        position: 'absolute'
      }}
      bounds={{
        top: bounds.top,
        left: bounds.left,
        right: bounds.right,
        bottom: bounds.bottom
      }}
      maxWidth={bounds.right - bounds.left}
      maxHeight={bounds.bottom - bounds.top}
      minWidth={isMobile ? '100%' : windowData.app.min_width || 400}
      minHeight={isMobile ? '100%' : windowData.app.min_height || 300}
      dragHandleClassName="window-handle"
      dragGrid={[1, 1]}
      cancel=".window-controls"
      enableResizing={!windowData.isMaximized && !isMobile}
      disableDragging={isMobile || windowData.isMaximized}
      default={{
        x: Math.max(bounds.left, Math.min(windowData.position.x, bounds.right - windowData.size.width)),
        y: Math.max(bounds.top, Math.min(windowData.position.y, bounds.bottom - windowData.size.height)),
        width: windowData.size.width,
        height: windowData.size.height,
      }}
      position={windowData.position}
      size={{
        width: windowData.size.width,
        height: windowData.size.height,
      }}
      onDragStart={(e) => {
        setIsDragging(true);
        // Calculate drag offset from mouse/touch position
        if (e.type === 'touchstart') {
          const touch = (e as TouchEvent).touches[0];
          setDragOffset({
            x: touch.clientX - windowData.position.x,
            y: touch.clientY - windowData.position.y
          });
        } else {
          const mouse = e as MouseEvent;
          setDragOffset({
            x: mouse.clientX - windowData.position.x,
            y: mouse.clientY - windowData.position.y
          });
        }
        
        // Add dragging class to body
        document.body.classList.add('cursor-grabbing');
      }}
      onDrag={(_e, d) => {
        // Get current event
        let clientX, clientY;

        if (_e.type === 'touchmove') {
          const touch = (_e as TouchEvent).touches[0];
          clientX = touch.clientX;
          clientY = touch.clientY;
        } else {
          const mouse = _e as MouseEvent;
          clientX = mouse.clientX;
          clientY = mouse.clientY;
        }

        // Calculate new position based on cursor/touch position and initial offset
        const newX = clientX - dragOffset.x;
        const newY = clientY - dragOffset.y;

        const width = typeof windowData.size.width === 'string'
          ? Math.min(parseInt(windowData.size.width), bounds.right - bounds.left)
          : windowData.size.width;
        const height = typeof windowData.size.height === 'string'
          ? Math.min(parseInt(windowData.size.height), bounds.bottom - bounds.top)
          : windowData.size.height;

        // Calculate maximum allowed positions

        const maxX = bounds.right - width;
        const maxY = bounds.bottom - height;
        // Apply bounds checking to new position
        const boundedX = Math.max(bounds.left, Math.min(newX, maxX));
        const boundedY = Math.max(bounds.top, Math.min(newY, maxY));

        // Apply new position with smooth transition
        updateWindow({
          ...windowData,
          position: { x: boundedX, y: boundedY }
        });
      }}
      onDragStop={(e, d) => {
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
        
        handleDragStop(e, d);
        document.body.classList.remove('cursor-grabbing');
      }}
      onResize={(e, direction, ref, delta, position) => {
        // Ensure window doesn't exceed bounds
        const width = Math.min(parseInt(ref.style.width), bounds.right - bounds.left);
        const height = Math.min(parseInt(ref.style.height), bounds.bottom - bounds.top);
        
        updateWindow({
          ...windowData,
          size: {
            width: `${width}px`,
            height: `${height}px`,
          },
          position,
        });
      }}
      onMouseDown={() => bringToFront(windowData.id)}
      onTouchStart={() => bringToFront(windowData.id)}
    >

      <div 
        ref={windowRef}
        className={`
          flex flex-col h-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden
          ${isFullscreen ? 'fixed inset-0 z-50' : ''}
        `}
      >
        <div 
          className={`
            window-handle flex items-center justify-between h-12 px-4
            bg-gray-900/95 backdrop-blur rounded-t-lg select-none
            ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
            transition-colors duration-200 touch-none
          `}
          onDoubleClick={() => !isMobile && toggleMaximize()}
        >
          {/* Left: Window Title */}
          <div className="w-1/3 text-white font-medium truncate">{windowData.app.name}</div>

          {/* Center: Window Controls */}
          <div className="flex items-center justify-center gap-1 w-1/3">
            <button
              type="button"
              className={`
                p-2 rounded-lg transition-colors touch-manipulation
                hover:bg-gray-700/50 active:bg-gray-700
              `}
              onClick={toggleMinimize}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('bg-gray-700');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('bg-gray-700');
                toggleMinimize();
              }}
              title="Minimize"
            >
              <Minus className={`w-${isMobile ? '5' : '4'} h-${isMobile ? '5' : '4'} text-gray-300`} />
            </button>
            <button
              type="button"
              className={`
                p-2 rounded-lg transition-colors touch-manipulation
                hover:bg-gray-700/50 active:bg-gray-700
              `}
              onClick={toggleMaximize}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('bg-gray-700');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('bg-gray-700');
                toggleMaximize();
              }}
              title="Maximize"
            >
              <Square className={`w-${isMobile ? '5' : '4'} h-${isMobile ? '5' : '4'} text-gray-300`} />
            </button>
            <button
              type="button"
              className={`
                p-2 rounded-lg transition-colors touch-manipulation
                hover:bg-gray-700/50 active:bg-gray-700
              `}
              onClick={toggleFullscreen}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('bg-gray-700');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('bg-gray-700');
                toggleFullscreen();
              }}
              title="Fullscreen"
            >
              <Maximize2 className={`w-${isMobile ? '5' : '4'} h-${isMobile ? '5' : '4'} text-gray-300`} />
            </button>
            <button
              type="button"
              className={`
                p-2 rounded-lg transition-colors touch-manipulation
                hover:bg-red-500/20 active:bg-red-500/30
              `}
              onClick={handleClose}
              onTouchStart={(e) => {
                e.currentTarget.classList.add('bg-red-500/30');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('bg-red-500/30');
                handleClose();
              }}
              title="Close"
            >
              <X className={`w-${isMobile ? '5' : '4'} h-${isMobile ? '5' : '4'} text-gray-300`} />
            </button>
          </div>
          
          {/* Right: Empty space to balance the layout */}
          <div className="w-1/3" />
        </div>

        {/* Window Content */}
        <div
          className={`
            flex-1 overflow-auto overscroll-contain
            ${isMobile ? 'p-3' : 'p-4'}
          `}
        >
          {windowData.app.url && (
            <IframeWithAuth
              url={windowData.app.url}
              title={windowData.app.name}
              className="w-full h-full border-0"
            />
          )}
          {windowData.app.type === 'component' && (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full bg-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-300">Loading...</div>
                  </div>
                </div>
              }
            >
              {loading && !windowData.app.url ? (
                <div className="flex items-center justify-center h-full bg-gray-900">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-gray-300">Loading app data...</div>
                  </div>
                </div>
              ) : (
                <Component />
              )}
            </Suspense>
          )}
        </div>
      </div>
    </Rnd>
  );
};

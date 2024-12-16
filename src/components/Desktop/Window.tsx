import React from 'react';
import { Rnd, RndDragEvent } from 'react-rnd';
import { Maximize, Minimize, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Window as WindowType } from '../../types';
import { Suspense } from 'react';
//import AppStore from '../apps/AppStore/AppStore';

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
    position: { x: number; y: number }
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

  const toggleMaximize = () => {
    console.log("toggleMaximize", window.isMaximized);
    updateWindow({
      ...window,
      isMaximized: !window.isMaximized,
      position: !window.isMaximized ? { x: 0, y: 0 } : window.position,
      size: !window.isMaximized
        ? { width: '100%', height: '100%' }
        : { width: 800, height: 600 },
    });
  };

  const Component = window.app.component; //window.app.component_path ? React.lazy(() => import(window.app.component_path)) : () => <div>Error: Application {window.app.name} can\`t be found</div>;
  
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
      minWidth={400}
      minHeight={300}
      bounds="window"
      onDragStop={handleDragStop}
      onResize={handleResize}
      onMouseDown={() => bringToFront(window.id)}
      dragHandleClassName="window-handle"
    >
      <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="window-handle flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
          <span className="text-sm font-medium">{window.app.name}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => updateWindow({ ...window, isMinimized: true })}
              className="p-1 hover:bg-gray-700 rounded"
              title="Minimize"
            >
              <Minimize className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMaximize}
              className="p-1 hover:bg-gray-700 rounded"
              title="Maximize"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button
              onClick={() => closeWindow(window.id)}
              className="p-1 hover:bg-gray-700 rounded"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1">
          {window.app.url && (
            <iframe
              src={window.app.url}
              className="w-full h-full border-0"
              title={window.app.name}
              referrerPolicy='no-referrer'
            />
          )}
          {window.app.type === 'component' && (
            <Suspense fallback={<div>Loading...</div>}>
              <Component />
            </Suspense>
          )}
        </div>
      </div>
    </Rnd>
  );
};
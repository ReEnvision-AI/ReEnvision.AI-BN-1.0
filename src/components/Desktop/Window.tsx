import React from "react";
import { Rnd, RndDragEvent } from "react-rnd";
import {
  ChevronDown,
  Minus,
  Square,
  X,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import type { Window as WindowType } from "../../types";
import { Suspense } from "react";
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
    console.log("isMaximized:", !window.isMaximized);
    console.log("position:", !window.isMaximized ? { x: 0, y: 0 } : window.position)
    console.log("size:", !window.isMaximized
      ? { width: "100%", height: "100%" }
      : { width: 800, height: 600 });


    updateWindow({
      ...window,
      isMaximized: !window.isMaximized,
      position: !window.isMaximized ? { x: 0, y: 0 } : window.position,
      size: !window.isMaximized
        ? { width: "100%", height: "100%" }
        : { width: 800, height: 600 },
    });
  };

  const Component = window.app.component; //window.app.component_path ? React.lazy(() => import(window.app.component_path)) : () => <div>Error: Application {window.app.name} can\`t be found</div>;

  return (
    <Rnd
      style={{
        zIndex: window.zIndex,
        display: window.isMinimized ? "none" : "block",
      }}
      default={{
        x: window.position.x,
        y: window.position.y,
        width: window.size.width,
        height: window.size.height,
      }}
      enableResizing={!window.isMaximized}
      minWidth={400}
      minHeight={300}
      bounds="window"
      onDragStop={handleDragStop}
      onResize={handleResize}
      onMouseDown={() => bringToFront(window.id)}
      onDragStart={()=>bringToFront(window.id)}
      dragHandleClassName="window-handle"
    >
      <div
        className="flex flex-col h-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
        onClick={() => bringToFront(window.id)}
      >
        <div className="window-handle flex items-center h-12 px-4 bg-gray-900 rounded-t-lg select-none">
          {/* Window Name */}
          <div className="flex-1 text-white font-medium truncate">
            {window.app.name}
          </div>

          {/* Window controls*/}
          <div className="flex items-center gap-1">
            {isMobile ? (
              <button
                className="relative flex items-center justify-center w-12 h-12 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors group touch-manipulation"
                aria-label="Minimize"
              >
                <ChevronDown className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
              </button>
            ) : (
              <>
              {/* Minimize Window Button */}
                <button
                  className="relative flex items-center justify-center w-10 h-10 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors group touch-manipulation"
                  aria-label="Minimize"
                >
                  <Minus className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                </button>

                {/* Maximize Window Button */}
                <button
                  className="relative flex items-center justify-center w-10 h-10 hover:bg-gray-700/50 active:bg-gray-700 rounded-lg transition-colors group touch-manipulation"
                  aria-label="Maximize"
                  onClick={()=>toggleMaximize()}
                >
                  <Square className="w-4 h-4 text-gray-300 group-hover:text-white transition-colors" />
                </button>
              </>
            )}
            {/* Close Button */}
            <button
              className={`
                      relative flex items-center justify-center
                      ${isMobile ? "w-12 h-12" : "w-10 h-10"}
                      hover:bg-red-500/20 active:bg-red-500/30
                      rounded-lg transition-colors group touch-manipulation
                    `}
              aria-label="Close"
              onClick={() => closeWindow(window.id)}
            >
              <X
                className={`
                      text-gray-300 group-hover:text-red-400 transition-colors
                      ${isMobile ? "w-6 h-6" : "w-4 h-4"}
                    `}
              />
            </button>
          </div>
          {/** 
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
          */}
        </div>
        <div className="flex-1">
          {window.app.url && (
            <iframe
              src={window.app.url}
              className="w-full h-full border-0"
              title={window.app.name}
              referrerPolicy="no-referrer"
            />
          )}
          {window.app.type === "component" && (
            <Suspense fallback={<div>Loading...</div>}>
              <Component />
            </Suspense>
          )}
        </div>
      </div>
    </Rnd>
  );
};

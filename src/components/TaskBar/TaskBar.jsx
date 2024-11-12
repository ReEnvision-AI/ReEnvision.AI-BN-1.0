import { useState } from 'react';
import { Menu, Power } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WindowButton } from './WindowButton';
import { StartMenu } from './StartMenu';

export function TaskBar({ windows, setWindows, onLogout }) {
  const [startOpen, setStartOpen] = useState(false);
  const {installedApps} = useApp();

  const toggleWindow = (window) => {
    setWindows(prev => prev.map(w => 
      w.id === window.id 
        ? { ...w, minimized: !w.minimized }
        : w
    ));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur border-t border-gray-700 safe-area-insets">
      <div className="flex h-full items-center px-2">
        <button
          onClick={() => setStartOpen(!startOpen)}
          className="
            p-dynamic hover:bg-white/10 rounded-lg 
            touch-manipulation cursor-pointer 
            min-w-touch min-h-touch 
            flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-white/20
            touch-feedback
          "
          aria-label="Open Start Menu"
        >
          <Menu className="w-[clamp(24px,6vw,32px)] h-[clamp(24px,6vw,32px)] text-white" />
        </button>

        <div className="
          flex-1 flex items-center justify-center 
          gap-dynamic px-dynamic 
          overflow-x-auto scroll-momentum
        ">
          {windows.map(window => (
            <WindowButton 
              key={window.id} 
              window={window}
              onClick={() => toggleWindow(window)}
              className="scale-on-mobile"
            />
          ))}
        </div>

        <button 
          onClick={onLogout}
          className="
            p-dynamic hover:bg-white/10 rounded-lg
            touch-manipulation cursor-pointer
            min-w-touch min-h-touch
            flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-white/20
            touch-feedback
          "
          aria-label="Logout"
        >
          <Power className="w-[clamp(20px,5vw,24px)] h-[clamp(20px,5vw,24px)] text-white/50 hover:text-white" />
        </button>
      </div>

      {startOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setStartOpen(false)}
          />
          <StartMenu 
            apps={installedApps}
            onLaunchApp={(app) => {
              setWindows(prev => [...prev, {
                id: Date.now(),
                title: app.name,
                content: <app.component />,
                icon: app.icon,
                x: Math.random() * (window.innerWidth - (app.width || 600)),
                y: Math.random() * (window.innerHeight - (app.height || 400)),
                width: app.width || 600,
                height: app.height || 400
              }]);
              setStartOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}
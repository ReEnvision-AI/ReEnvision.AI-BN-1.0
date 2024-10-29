import { useState } from 'react';
import { Menu, Power, FileText, Calculator, Settings, Terminal, Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TextPad } from './apps/TextPad';
import { Calculator as CalculatorApp } from './apps/Calculator';
import { Settings as SettingsApp } from './apps/Settings/Settings';
import { Terminal as TerminalApp } from './apps/Terminal';
import { AppStore } from './apps/AppStore';

export function TaskBar({ windows, setWindows, onLogout }) {
  const [startOpen, setStartOpen] = useState(false);
  const { settings, installedApps } = useApp();

  const defaultApps = [
    { 
      id: 'textpad', 
      name: 'TextPad',
      icon: FileText,
      component: TextPad,
      width: 600,
      height: 400
    },
    { 
      id: 'calculator', 
      name: 'Calculator',
      icon: Calculator,
      component: CalculatorApp,
      width: 320,
      height: 480
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      component: SettingsApp,
      width: 800,
      height: 600
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: Terminal,
      component: TerminalApp,
      width: 600,
      height: 400
    },
    {
      id: 'appstore',
      name: 'App Store',
      icon: Store,
      component: AppStore,
      width: 900,
      height: 600
    }
  ];

  const availableApps = defaultApps.filter(app => 
    app.id === 'settings' || 
    app.id === 'appstore' || 
    installedApps?.includes(app.id)
  );

  const launchApp = (app) => {
    setWindows(prev => [...prev, {
      id: Date.now(),
      title: app.name,
      content: <app.component />,
      icon: app.icon,
      x: Math.random() * (window.innerWidth - app.width),
      y: Math.random() * (window.innerHeight - app.height),
      width: app.width,
      height: app.height
    }]);
    setStartOpen(false);
  };

  const toggleWindow = (window) => {
    setWindows(prev => prev.map(w => 
      w.id === window.id 
        ? { ...w, minimized: !w.minimized }
        : w
    ));
  };

  function WindowButton({ window, onClick }) {
    const Icon = window.icon || Menu;
    
    return (
      <div 
        className={`
          flex flex-col items-center min-w-[80px] p-2 rounded-lg cursor-pointer
          touch-manipulation transition-colors
          ${window.minimized ? 'bg-transparent hover:bg-white/10' : 'bg-white/20'}
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

  function StartMenu({ apps, onLaunchApp }) {
    return (
      <div className="absolute bottom-16 left-0 w-64 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-t-lg p-2 z-50">
        <div className="grid gap-1">
          {apps.map(app => (
            <MenuItem 
              key={app.id}
              name={app.name}
              Icon={app.icon}
              onClick={() => onLaunchApp(app)}
            />
          ))}
        </div>
      </div>
    );
  }

  function MenuItem({ name, Icon = Menu, onClick }) {
    return (
      <div 
        className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg text-white w-full text-left touch-manipulation cursor-pointer"
        onClick={onClick}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm">{name}</span>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-900/95 backdrop-blur border-t border-gray-700">
      <div className="flex h-full items-center px-2">
        <div
          onClick={() => setStartOpen(!startOpen)}
          className="p-2 hover:bg-white/10 rounded-lg touch-manipulation cursor-pointer"
        >
          <Menu className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 flex items-center justify-center gap-2 px-2 overflow-x-auto">
          {windows.map(window => (
            <WindowButton 
              key={window.id} 
              window={window}
              onClick={() => toggleWindow(window)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 px-2">
          <span className="text-white/50 text-sm">{settings.username}</span>
          <div 
            className="cursor-pointer"
            onClick={onLogout}
          >
            <Power className="w-5 h-5 text-white/50 hover:text-white" />
          </div>
        </div>
      </div>

      {startOpen && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setStartOpen(false)}
          />
          <StartMenu 
            apps={availableApps}
            onLaunchApp={launchApp}
          />
        </>
      )}
    </div>
  );
}
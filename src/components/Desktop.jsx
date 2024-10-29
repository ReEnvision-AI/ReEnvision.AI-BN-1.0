import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useApp } from '../context/AppContext';
import { FileText, Calculator, Settings, Terminal, Store } from 'lucide-react';
import { TextPad } from './apps/TextPad';
import { Calculator as CalculatorApp } from './apps/Calculator';
import { Settings as SettingsApp } from './apps/Settings/Settings';
import { Terminal as TerminalApp } from './apps/Terminal';
import { AppStore } from './apps/AppStore/AppStore';

export function Desktop({ children, windows, setWindows }) {
  const { installedApps } = useApp();
  const [icons, setIcons] = useState(() => {
    const defaultIcons = [
      { 
        id: 'textpad',
        name: 'TextPad',
        icon: FileText,
        component: TextPad,
        x: 20,
        y: 20,
        width: 600,
        height: 400
      },
      { 
        id: 'calculator',
        name: 'Calculator',
        icon: Calculator,
        component: CalculatorApp,
        x: 100,
        y: 20,
        width: 320,
        height: 480
      },
      {
        id: 'settings',
        name: 'Settings',
        icon: Settings,
        component: SettingsApp,
        x: 180,
        y: 20,
        width: 800,
        height: 600,
        permanent: true
      },
      {
        id: 'terminal',
        name: 'Terminal',
        icon: Terminal,
        component: TerminalApp,
        x: 260,
        y: 20,
        width: 600,
        height: 400
      },
      {
        id: 'appstore',
        name: 'App Store',
        icon: Store,
        component: AppStore,
        x: 340,
        y: 20,
        width: 900,
        height: 600,
        permanent: true
      }
    ];
    return defaultIcons;
  });

  const visibleIcons = icons.filter(icon => 
    icon.permanent || installedApps?.includes(icon.id)
  );

  const openApp = (app) => {
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
  };

  const handleIconMove = (id, position) => {
    setIcons(prev => prev.map(icon => 
      icon.id === id ? { ...icon, ...position } : icon
    ));
  };

  return (
    <div className="absolute inset-0 pb-16">
      <div className="relative h-full">
        {visibleIcons.map(app => (
          <Rnd
            key={app.id}
            default={{
              x: app.x,
              y: app.y,
              width: 80,
              height: 90
            }}
            minWidth={80}
            minHeight={90}
            bounds="parent"
            enableResizing={false}
            onDragStop={(e, d) => handleIconMove(app.id, { x: d.x, y: d.y })}
          >
            <div
              className="flex flex-col items-center p-2 rounded hover:bg-white/10 cursor-pointer"
              onDoubleClick={() => openApp(app)}
              onTouchEnd={(e) => {
                if (e.timeStamp - e.currentTarget.dataset.lastTap < 300) {
                  openApp(app);
                }
                e.currentTarget.dataset.lastTap = e.timeStamp;
              }}
            >
              <app.icon className="w-12 h-12 text-white" />
              <span className="text-white text-sm mt-1 text-center">{app.name}</span>
            </div>
          </Rnd>
        ))}
        {children}
      </div>
    </div>
  );
}
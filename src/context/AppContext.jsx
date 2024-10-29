import { createContext, useContext, useState, useEffect } from 'react';
import { 
  FileText, Calculator, Settings, Terminal, Store,
  FolderOpen, Cpu, Table, Presentation, MessageSquare, Brain 
} from 'lucide-react';
import { TextPad } from '../components/apps/TextPad';
import { Calculator as CalculatorApp } from '../components/apps/Calculator';
import { Settings as SettingsApp } from '../components/apps/Settings/Settings';
import { Terminal as TerminalApp } from '../components/apps/Terminal';
import { AppStore } from '../components/apps/AppStore/AppStore';
import { FileManager } from '../components/apps/FileManager/FileManager';
import { AIDevStudio } from '../components/apps/AIDevStudio/AIDevStudio';
import { DataGrid } from '../components/apps/DataGrid/DataGrid';
import { Prez } from '../components/apps/Prez/Prez';
import { ChatyAI } from '../components/apps/ChatyAI/ChatyAI';
import { LocalAI } from '../components/apps/LocalAI/LocalAI';

const AppContext = createContext(null);

const defaultSettings = {
  theme: 'dark',
  wallpaper: 'linear-gradient(to right bottom, #2D3436, #000428, #004E92, #000428, #2D3436)',
  username: 'demo',
  iconSize: 'medium',
  gridSpacing: 20,
  gridEnabled: true,
  iconColor: '#FFFFFF'
};

const defaultApps = [
  {
    id: 'chatyai',
    name: 'Chaty AI',
    icon: MessageSquare,
    component: ChatyAI,
    width: 1200,
    height: 800,
    canUninstall: true
  },
  {
    id: 'localai',
    name: 'Local AI',
    icon: Brain,
    component: LocalAI,
    width: 1200,
    height: 800,
    canUninstall: true
  },
  {
    id: 'textpad',
    name: 'TextPad',
    icon: FileText,
    component: TextPad,
    width: 600,
    height: 400,
    canUninstall: true
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: Calculator,
    component: CalculatorApp,
    width: 320,
    height: 480,
    canUninstall: true
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: Settings,
    component: SettingsApp,
    width: 800,
    height: 600,
    canUninstall: false
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    component: TerminalApp,
    width: 600,
    height: 400,
    canUninstall: true
  },
  {
    id: 'appstore',
    name: 'App Store',
    icon: Store,
    component: AppStore,
    width: 900,
    height: 600,
    canUninstall: false
  },
  {
    id: 'files',
    name: 'Files',
    icon: FolderOpen,
    component: FileManager,
    width: 800,
    height: 600,
    canUninstall: false
  },
  {
    id: 'aidevstudio',
    name: 'AI Dev Studio',
    icon: Cpu,
    component: AIDevStudio,
    width: 1200,
    height: 800,
    canUninstall: true
  },
  {
    id: 'datagrid',
    name: 'DataGrid',
    icon: Table,
    component: DataGrid,
    width: 1200,
    height: 800,
    canUninstall: true
  },
  {
    id: 'prez',
    name: 'Prez',
    icon: Presentation,
    component: Prez,
    width: 1200,
    height: 800,
    canUninstall: true
  }
];

export function AppContextProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [installedApps, setInstalledApps] = useState(() => {
    const saved = localStorage.getItem('installedApps');
    return saved ? JSON.parse(saved) : [
      'chatyai',
      'localai',
      'textpad',
      'calculator',
      'terminal',
      'aidevstudio',
      'datagrid',
      'prez'
    ];
  });

  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem('files');
    return saved ? JSON.parse(saved) : {
      'home': {
        'demo': {
          'Documents': {},
          'Pictures': {},
          'Music': {},
          'Downloads': {}
        }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('installedApps', JSON.stringify(installedApps));
  }, [installedApps]);

  useEffect(() => {
    localStorage.setItem('files', JSON.stringify(files));
  }, [files]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const installApp = (appId) => {
    setInstalledApps(prev => [...new Set([...prev, appId])]);
  };

  const uninstallApp = (appId) => {
    setInstalledApps(prev => prev.filter(id => id !== appId));
  };

  const getAppById = (id) => {
    return defaultApps.find(app => app.id === id);
  };

  const apps = defaultApps.filter(app => 
    !app.canUninstall || installedApps.includes(app.id)
  );

  const value = {
    settings,
    updateSetting,
    installedApps,
    installApp,
    uninstallApp,
    apps,
    getAppById,
    files,
    setFiles
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}
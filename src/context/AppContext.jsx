import { createContext, useContext, useState, useEffect } from 'react';
import { defaultApps } from '../data/defaultApps';

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

export function AppContextProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [installedApps, setInstalledApps] = useState(() => {
    const saved = localStorage.getItem('installedApps');
    return saved ? JSON.parse(saved) : [
      'aibrowser',
      'chatyai',
      'localai',
      'textpad',
      'calculator',
      'terminal',
      'aidevstudio',
      'prez',
      'salesflow'
    ];
  });

  const [apps, setApps] = useState(() => {
    const saved = localStorage.getItem('apps');
    return saved ? JSON.parse(saved) : defaultApps;
  });

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('installedApps', JSON.stringify(installedApps));
  }, [installedApps]);

  useEffect(() => {
    localStorage.setItem('apps', JSON.stringify(apps));
  }, [apps]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const installApp = async (appId, appRegistration, appFiles) => {
    try {
      // Store app files in localStorage
      Object.entries(appFiles).forEach(([path, content]) => {
        localStorage.setItem(`app_file:${path}`, content);
      });

      // Load the app's component dynamically
      const componentPath = `/apps/${appId}/${appRegistration.component}`;
      const componentContent = localStorage.getItem(`app_file:${componentPath}`);
      if (!componentContent) {
        throw new Error('Component file not found');
      }

      // Register app in the system
      const newApps = [...apps, appRegistration];
      localStorage.setItem('apps', JSON.stringify(newApps));
      setApps(newApps);

      // Add to installed apps list
      const newInstalledApps = [...installedApps, appId];
      localStorage.setItem('installedApps', JSON.stringify(newInstalledApps));
      setInstalledApps(newInstalledApps);

    } catch (error) {
      console.error('Failed to install app:', error);
      throw new Error('Failed to install application');
    }
  };

  const uninstallApp = (appId) => {
    // Remove app files from localStorage
    const prefix = `app_file:/apps/${appId}/`;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });

    // Remove from apps list
    const newApps = apps.filter(app => app.id !== appId);
    localStorage.setItem('apps', JSON.stringify(newApps));
    setApps(newApps);

    // Remove from installed apps
    const newInstalledApps = installedApps.filter(id => id !== appId);
    localStorage.setItem('installedApps', JSON.stringify(newInstalledApps));
    setInstalledApps(newInstalledApps);
  };

  const getAppFiles = (appId) => {
    const files = {};
    const prefix = `app_file:/apps/${appId}/`;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        files[key.replace(prefix, '')] = localStorage.getItem(key);
      }
    });
    return files;
  };

  const value = {
    settings,
    updateSetting,
    installedApps,
    installApp,
    uninstallApp,
    apps,
    getAppFiles,
    getAppById: (id) => apps.find(app => app.id === id)
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
import { useState, useEffect } from 'react';
import { AppRegistry } from '../services/appRegistry';
import { AppInfo, AppState } from '../types/apps';

export function useAppRegistry() {
  const registry = AppRegistry.getInstance();
  const [apps, setApps] = useState<AppInfo[]>(registry.getAllApps());
  const [appStates, setAppStates] = useState<Record<string, AppState>>({});

  useEffect(() => {
    // Initialize app states
    const states: Record<string, AppState> = {};
    registry.getAllApps().forEach(app => {
      states[app.id] = {
        installed: registry.isInstalled(app.id),
        installing: false
      };
    });
    setAppStates(states);
  }, []);

  const installApp = async (appId: string) => {
    setAppStates(prev => ({
      ...prev,
      [appId]: { ...prev[appId], installing: true }
    }));

    try {
      // Simulate installation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      registry.installApp(appId);
      
      setAppStates(prev => ({
        ...prev,
        [appId]: { installed: true, installing: false }
      }));
    } catch (error) {
      setAppStates(prev => ({
        ...prev,
        [appId]: { 
          installed: false, 
          installing: false,
          error: error instanceof Error ? error.message : 'Installation failed'
        }
      }));
    }
  };

  const uninstallApp = async (appId: string) => {
    setAppStates(prev => ({
      ...prev,
      [appId]: { ...prev[appId], installing: true }
    }));

    try {
      // Simulate uninstallation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      registry.uninstallApp(appId);
      
      setAppStates(prev => ({
        ...prev,
        [appId]: { installed: false, installing: false }
      }));
    } catch (error) {
      setAppStates(prev => ({
        ...prev,
        [appId]: { 
          ...prev[appId],
          installing: false,
          error: error instanceof Error ? error.message : 'Uninstallation failed'
        }
      }));
    }
  };

  return {
    apps,
    appStates,
    installApp,
    uninstallApp,
    getInstalledApps: () => registry.getInstalledApps(),
    getInstallableApps: () => registry.getInstallableApps(),
    isInstalled: (id: string) => registry.isInstalled(id),
    getAppById: (id: string) => registry.getAppById(id)
  };
}
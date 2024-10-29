import { AppInfo } from '../types/apps';
import { defaultApps } from '../data/defaultApps';

export class AppRegistry {
  private static instance: AppRegistry;
  private apps: Map<string, AppInfo>;
  private installedApps: Set<string>;

  private constructor() {
    this.apps = new Map();
    this.installedApps = new Set();
    this.initializeRegistry();
  }

  static getInstance(): AppRegistry {
    if (!AppRegistry.instance) {
      AppRegistry.instance = new AppRegistry();
    }
    return AppRegistry.instance;
  }

  private initializeRegistry() {
    // Load default apps
    defaultApps.forEach(app => {
      this.registerApp(app);
    });

    // Load installed apps from localStorage
    const installed = localStorage.getItem('installedApps');
    if (installed) {
      JSON.parse(installed).forEach((id: string) => {
        this.installedApps.add(id);
      });
    }
  }

  registerApp(app: AppInfo) {
    this.apps.set(app.id, app);
  }

  unregisterApp(appId: string) {
    this.apps.delete(appId);
    this.installedApps.delete(appId);
    this.saveInstalledApps();
  }

  installApp(appId: string) {
    if (this.apps.has(appId)) {
      this.installedApps.add(appId);
      this.saveInstalledApps();
    }
  }

  uninstallApp(appId: string) {
    this.installedApps.delete(appId);
    this.saveInstalledApps();
  }

  private saveInstalledApps() {
    localStorage.setItem('installedApps', JSON.stringify(Array.from(this.installedApps)));
  }

  isInstalled(appId: string): boolean {
    return this.installedApps.has(appId);
  }

  getAllApps(): AppInfo[] {
    return Array.from(this.apps.values());
  }

  getInstalledApps(): AppInfo[] {
    return Array.from(this.apps.values()).filter(app => this.installedApps.has(app.id));
  }

  getInstallableApps(): AppInfo[] {
    return Array.from(this.apps.values()).filter(app => !this.installedApps.has(app.id));
  }

  getAppById(id: string): AppInfo | undefined {
    return this.apps.get(id);
  }
}
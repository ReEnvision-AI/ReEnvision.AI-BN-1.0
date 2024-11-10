import { Store } from "lucide-react";
import { AppStore } from "./AppStore";

const AppStoreManifest = {
  id: 'appstore',
  name: 'App Store',
  description: 'Browse and install applications',
  icon: Store,
  component: AppStore,
  category: 'system',
  version: '1.0.0',
  author: 'StackBlitz',
  width: 900,
  height: 600,
  canUninstall: false,
  permanent: true,
  screenshots: [
    'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80'
  ],
  features: [
    'Browse available applications',
    'Install and uninstall apps',
    'View app details and screenshots',
    'Import custom applications'
  ]
}

export default AppStoreManifest;
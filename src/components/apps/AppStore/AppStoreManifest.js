import { Store } from 'lucide-react';
import AppStore from './AppStore';

const AppStoreManifest = {
  id: 'appstore',
  name: 'App Store',
  description: 'Browse and install applications',
  icon: Store,
  type: 'component',
  component: AppStore,
  preferred_width: 900,
  preferred_height: 600,
  min_width: 600,
  min_height: 400,
  screenshots: ['https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80'],
  features: ['Browse available applications', 'Install and uninstall apps', 'View app details and screenshots'],
};

export default AppStoreManifest;

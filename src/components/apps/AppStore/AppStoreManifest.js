import { Store } from 'lucide-react';
import AppStore from './AppStore';

const AppStoreManifest = {
  id: 'f8ad4840-ab66-478b-94dd-412cd9da678c',
  name: 'App Store',
  description: 'Browse and install applications',
  icon: 'store',
  type: 'component',
  component: AppStore,
  preferred_width: 900,
  preferred_height: 600,
  min_width: 600,
  min_height: 400,
  screenshots: ['https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80'],
  features: ['Browse available applications', 'Install and uninstall apps', 'View app details and screenshots'],
  category: 'Utilities',
  tier: 'base'
};

export default AppStoreManifest;

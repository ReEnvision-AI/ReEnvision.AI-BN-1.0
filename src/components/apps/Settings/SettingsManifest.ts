import { Settings } from 'lucide-react';
import SettingsApp from './Settings';

const SettingsManifest = {
  id: 'settings',
  name: 'Settings',
  icon: 'settings', // Use string identifier instead of component
  type: 'component',
  component: SettingsApp,
  preferred_width: 400,
  preferred_height: 600,
  min_width: 300,
  min_height: 400,
  description: 'System settings and customization',
  screenshots: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80'],
  features: ['Desktop customization', 'Taskbar settings', 'System preferences'],
  category: 'Utilities',
  tier: 'base'
};

export default SettingsManifest;
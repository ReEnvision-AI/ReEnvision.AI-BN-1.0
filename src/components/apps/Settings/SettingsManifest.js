import { Settings} from "lucide-react";
import { Settings as SettingsApp } from './Settings'

const SettingsManifest = {
  id: 'settings',
  name: 'Settings',
  icon: Settings,
  component: SettingsApp,
  description: 'System settings and configuration.',
  category: 'system',
  width: 800,
  height: 600,
  canUninstall: false,
  permanent: true
}

export default SettingsManifest;
import { AppInfo } from '../../../types/apps';
import { Presentation } from 'lucide-react';
import { Prez } from './Prez';

export const PrezManifest: AppInfo = {
  id: 'prez',
  name: 'Prez',
  description: 'Create and present beautiful presentations with an intuitive interface',
  icon: Presentation,
  component: Prez,
  category: 'productivity',
  version: '1.0.0',
  author: 'StackBlitz',
  width: 1200,
  height: 800,
  canUninstall: true,
  screenshots: [
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80'
  ],
  features: [
    'Create professional presentations',
    'Rich text editing and formatting',
    'Shape and image support',
    'Full-screen presentation mode',
    'Export and sharing capabilities'
  ],
  keywords: ['presentation', 'slides', 'powerpoint', 'keynote'],
  requirements: {
    'Storage': '50MB',
    'Memory': '256MB'
  }
}
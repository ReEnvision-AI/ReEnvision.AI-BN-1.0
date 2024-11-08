//import { AppInfo } from '../../../types/apps';
import { AppInfo } from '@reai/types';
import { Globe } from 'lucide-react';
import { AIBrowser } from './AIBrowser';

export const AIBrowserManifest: AppInfo = {
  id: 'aibrowser',
  name: 'AI Browser',
  description: 'AI-powered web browser with intelligent content analysis and assistance',
  icon: Globe,
  component: AIBrowser,
  category: 'productivity',
  version: '1.0.0',
  author: 'StackBlitz',
  width: 1200,
  height: 800,
  canUninstall: true,
  screenshots: [
    'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800&q=80',
    'https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?w=800&q=80'
  ],
  features: [
    'AI-powered content analysis',
    'Smart search suggestions',
    'Content summarization',
    'Translation capabilities',
    'Tab management',
    'Privacy-focused browsing'
  ],
  keywords: ['browser', 'ai', 'web', 'internet'],
  requirements: {
    'Storage': '50MB',
    'Memory': '256MB'
  }
};
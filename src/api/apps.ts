import React, { LazyExoticComponent, ComponentType } from 'react';

export type App = {
  id: string;
  name: string;
  icon: string;
  type?: string;
  component?: LazyExoticComponent<ComponentType>;
  url?: string;
  preferred_width?: number;
  preferred_height?: number;
  min_width?: number;
  min_height?: number;
  description?: string;
  screenshots?: string[];
  features?: string[];
};

const DEFAULT_APPS: App[] = [
  {
    id: 'f8ad4840-ab66-478b-94dd-412cd9da678c',
    name: 'App Store',
    icon: 'store',
    type: 'component',
    component: React.lazy(() => import('../components/apps/AppStore/AppStore')),
    preferred_width: 900,
    preferred_height: 600,
    description: 'Browse and install applications',
    screenshots: ['https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80'],
    features: ['Browse available applications', 'Install and uninstall apps', 'View app details and screenshots'],
  },
  {
    id: 'fd3fa276-c543-4081-999b-459a688bd7a7',
    name: 'Chatty AI',
    icon: 'messagesquare',
    type: 'component',
    component: React.lazy(() => import('../components/apps/ChattyAI/ChattyAI')),
    preferred_width: 1200,
    preferred_height: 800,
    description: 'Local LLM inference engine with chat interface',
    screenshots: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'],
    features: [
      'Local LLM inference using WebGPU',
      'Real-time chat interface',
      'Multiple model support',
      'Response streaming',
      'Resource monitoring',
    ],
  },
];

export function getDefaultApps(): App[] {
  return DEFAULT_APPS;
}

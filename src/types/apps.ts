import { LucideIcon } from 'lucide-react';

export interface AppInfo {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  component: React.ComponentType;
  category: AppCategory;
  version: string;
  author: string;
  screenshots?: string[];
  features?: string[];
  keywords?: string[];
  requirements?: {
    [key: string]: string;
  };
  canUninstall: boolean;
  width?: number;
  height?: number;
}

export type AppCategory = 
  | 'development'
  | 'productivity'
  | 'utilities'
  | 'system';

export interface AppState {
  installed: boolean;
  installing: boolean;
  error?: string;
}
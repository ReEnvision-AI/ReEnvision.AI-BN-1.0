import React, { LazyExoticComponent, ComponentType } from 'react';
import FileSystemManifest from '../components/apps/FileSystem/FileSystemManifest';
import AppStoreManifest from '../components/apps/AppStore/AppStoreManifest';
import SettingsManifest from '../components/apps/Settings/SettingsManifest';

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
  category?: string;
};

const DEFAULT_APPS: App[] = [
  FileSystemManifest,
  AppStoreManifest,
  SettingsManifest,
];

export function getDefaultApps(): App[] {
  return DEFAULT_APPS;
}

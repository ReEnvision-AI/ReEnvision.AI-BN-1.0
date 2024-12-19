/*export interface App {
    id: string;
    name: string;
    icon: string;
    type: 'url' | 'component';
    url: string | null;
    component_path: string | null;
    preferred_height?: number;
    preferred_width?: number;
    min_height?: number;
    min_width?: number;
    created_at?: string;
    user_id?: string;
};*/

import { App } from '../api/apps';
export { App } from '../api/apps';

export interface Window {
  id: string;
  app: App;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

import {
  Store,
  FileText,
  FolderOpen,
  Calculator,
  Terminal,
  Globe, // Changed from Browser
  MessageSquare,
  Code,
  Settings,
  // Bot, // Removed Bot icon
  Blocks,
  Grid2x2X,
  AppWindow, // Added as another fallback
} from 'lucide-react';

export const iconMap = {
  store: Store,
  'file-text': FileText,
  folderopen: FolderOpen,
  calculator: Calculator,
  terminal: Terminal,
  browser: Globe, // Changed to use Globe instead of Browser
  settings: Settings,
  chat: MessageSquare,
  code: Code,
  // bot: Bot, // Removed Bot icon mapping
  messagesquare: MessageSquare,
  blocks: Blocks,
  tictactoe: Grid2x2X,
  app: AppWindow, // Added as default app icon
};

export type IconType = keyof typeof iconMap;

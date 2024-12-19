import {
  Store,
  FileText,
  Calculator,
  Terminal,
  Globe, // Changed from Browser
  MessageSquare,
  Code,
  Settings,
  Bot,
  AppWindow, // Added as another fallback
} from 'lucide-react';

export const iconMap = {
  store: Store,
  'file-text': FileText,
  calculator: Calculator,
  terminal: Terminal,
  browser: Globe, // Changed to use Globe instead of Browser
  chat: MessageSquare,
  code: Code,
  settings: Settings,
  bot: Bot,
  messagesquare: MessageSquare,
  app: AppWindow, // Added as default app icon
};

export type IconType = keyof typeof iconMap;

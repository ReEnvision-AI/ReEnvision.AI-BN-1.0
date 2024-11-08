import { 
  FileText, Calculator, Settings, Terminal, Store,
  Cpu, FolderOpen, Presentation, MessageSquare, Brain, 
  LayoutDashboard, Globe 
} from 'lucide-react';
import { TextPad } from '../components/apps/TextPad';
import { Calculator as CalculatorApp } from '../components/apps/Calculator';
import { Settings as SettingsApp } from '../components/apps/Settings/Settings';
import { Terminal as TerminalApp } from '../components/apps/Terminal';
import { AppStore } from '../components/apps/AppStore/AppStore';
import { FileManager } from '../components/apps/FileManager/FileManager';
//import { AIDevStudio } from '../components/apps/AIDevStudio/AIDevStudio';
import { Prez } from '../components/apps/Prez/Prez';
import { PrezManifest } from '../components/apps/Prez/manifest';
//import { LocalAI } from '../components/apps/LocalAI/LocalAI';
//import { ChatyAI } from '../components/apps/ChatyAI/ChatyAI';
import { SalesFlow } from '../components/apps/SalesFlow/SalesFlow';
import { AIBrowser } from '@reai/aibrowser';
import { AIDevStudio } from '@reai/aidevstudio';
import { ChattyAI } from '@reai/chattyai';
import { LocalAI } from '@reai/locali';

export const defaultApps = [
  {
    id: 'appstore',
    name: 'App Store',
    description: 'Browse and install applications',
    icon: Store,
    component: AppStore,
    category: 'system',
    version: '1.0.0',
    author: 'StackBlitz',
    width: 900,
    height: 600,
    canUninstall: false,
    permanent: true,
    screenshots: [
      'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80'
    ],
    features: [
      'Browse available applications',
      'Install and uninstall apps',
      'View app details and screenshots',
      'Import custom applications'
    ]
  },
  {
    id: 'aibrowser',
    name: 'AI Browser',
    description: 'AI-powered web browser with intelligent content analysis',
    icon: Globe,
    component: AIBrowser,
    category: 'productivity',
    version: '1.0.0',
    author: 'StackBlitz',
    width: 1200,
    height: 800,
    canUninstall: true,
    screenshots: [
      'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=800&q=80'
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
  },
  {
    id: 'salesflow',
    name: 'SalesFlow',
    description: 'Modern CRM with AI-powered features',
    icon: LayoutDashboard,
    component: SalesFlow,
    category: 'productivity',
    version: '1.0.0',
    author: 'StackBlitz',
    width: 1200,
    height: 800,
    canUninstall: true,
    screenshots: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    ],
    features: [
      'Contact management with business card scanning',
      'Sales pipeline with drag-and-drop interface',
      'Product catalog and inventory management',
      'Real-time analytics and reporting',
      'AI-powered insights'
    ],
    keywords: ['crm', 'sales', 'contacts', 'pipeline'],
    requirements: {
      'Storage': '100MB',
      'Memory': '256MB'
    }
  },
  {
    id: 'chattyai',
    name: 'Chatty AI',
    description: 'Local LLM inference engine with chat interface',
    icon: MessageSquare,
    component: ChattyAI,
    category: 'development',
    version: '1.0.0',
    author: 'StackBlitz',
    width: 1200,
    height: 800,
    canUninstall: true,
    screenshots: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
    ],
    features: [
      'Local LLM inference using WebGPU',
      'Real-time chat interface',
      'Multiple model support',
      'Response streaming',
      'Resource monitoring'
    ],
    keywords: ['ai', 'llm', 'chat'],
    requirements: {
      'Storage': '100MB',
      'Memory': '512MB'
    }
  },
  {
    id: 'localai',
    name: 'Local AI',
    description: 'Local LLM inference engine with OpenAI-compatible API',
    icon: Brain,
    component: LocalAI,
    category: 'development',
    version: '1.0.0',
    author: 'StackBlitz',
    width: 1200,
    height: 800,
    canUninstall: true,
    screenshots: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
    ],
    features: [
      'Local LLM inference using WebLLM',
      'OpenAI-compatible REST API',
      'Built-in chat interface',
      'Multiple model support',
      'Real-time response streaming',
      'System resource monitoring'
    ],
    keywords: ['ai', 'llm', 'inference', 'api'],
    requirements: {
      'Storage': '100MB',
      'Memory': '512MB'
    }
  },
  PrezManifest,
  {
    id: 'aidevstudio',
    name: 'AI Dev Studio',
    icon: Cpu,
    component: AIDevStudio,
    description: 'AI-powered development environment.',
    category: 'development',
    version: '1.0.0',
    author: 'StackBlitz',
    width: 1200,
    height: 800,
    canUninstall: true,
    screenshots: [
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80'
    ],
    features: [
      'AI-powered code generation',
      'Advanced code editor with TypeScript support',
      'Live preview with hot reload',
      'Project management and version control',
      'One-click deployment'
    ]
  },
  {
    id: 'textpad',
    name: 'TextPad',
    icon: FileText,
    component: TextPad,
    description: 'A simple text editor for quick notes and coding.',
    category: 'productivity',
    width: 600,
    height: 400,
    canUninstall: true,
    screenshots: ['https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80']
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: Calculator,
    component: CalculatorApp,
    description: 'Basic calculator with standard operations.',
    category: 'utilities',
    width: 320,
    height: 480,
    canUninstall: true,
    screenshots: ['https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&q=80']
  },
  {
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
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    component: TerminalApp,
    description: 'Command line interface for system operations.',
    category: 'development',
    width: 600,
    height: 400,
    canUninstall: true,
    screenshots: ['https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&q=80']
  },
  {
    id: 'files',
    name: 'Files',
    icon: FolderOpen,
    component: FileManager,
    description: 'File system management.',
    category: 'system',
    width: 800,
    height: 600,
    canUninstall: false,
    permanent: true
  }
];
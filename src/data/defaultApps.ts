import { 
  FileText, Calculator, Settings, Terminal, Store,
  Cpu, FolderOpen, Table, Presentation, MessageSquare
} from 'lucide-react';
import { TextPad } from '../components/apps/TextPad';
import { Calculator as CalculatorApp } from '../components/apps/Calculator';
import { Settings as SettingsApp } from '../components/apps/Settings/Settings';
import { Terminal as TerminalApp } from '../components/apps/Terminal';
import { DataGrid } from '../components/apps/DataGrid/DataGrid';
import { AIDevStudio } from '../components/apps/AIDevStudio/AIDevStudio';
import { Prez } from '../components/apps/Prez/Prez';
import { PrezManifest } from '../components/apps/Prez/manifest';
import { LocalAI } from '../components/apps/LocalAI/LocalAI';
import { ChatyAI } from '../components/apps/ChatyAI/ChatyAI';

export const defaultApps = [
  {
    id: 'chatyai',
    name: 'Chaty AI',
    description: 'Local LLM inference engine with chat interface',
    icon: MessageSquare,
    component: ChatyAI,
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
    icon: MessageSquare,
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
    description: 'AI-powered development environment for building React applications',
    features: [
      'AI-powered code generation',
      'Advanced code editor with TypeScript support',
      'Live preview with hot reload',
      'Project management and version control',
      'One-click deployment'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80'
    ],
    category: 'development',
    version: '1.0.0',
    author: 'StackBlitz',
    keywords: ['ai', 'development', 'code-editor', 'react'],
    requirements: {
      'Storage': '100MB',
      'Memory': '512MB'
    },
    width: 1200,
    height: 800,
    canUninstall: true
  },
  {
    id: 'datagrid',
    name: 'DataGrid',
    icon: Table,
    component: DataGrid,
    description: 'Advanced spreadsheet application with data visualization capabilities.',
    features: [
      'Advanced cell editing and formatting',
      'Data visualization with charts',
      'Excel/CSV import/export',
      'Formula support',
      'Collaborative editing'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
    ],
    category: 'productivity',
    version: '1.0.0',
    author: 'StackBlitz',
    keywords: ['spreadsheet', 'excel', 'data', 'charts'],
    requirements: {
      'Storage': '50MB',
      'Memory': '256MB'
    },
    width: 1200,
    height: 800,
    canUninstall: true
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
  }
];
import { 
  FileText, Calculator, Terminal, Settings, FolderOpen,
  Globe, Database, Package, Wand2, Table, Cpu, Presentation,
  MessageSquare, Brain
} from 'lucide-react';
import { TextPad } from '../TextPad';
import { Calculator as CalculatorApp } from '../Calculator';
import { Terminal as TerminalApp } from '../Terminal';
import { DataGrid } from '../DataGrid/DataGrid';
import { AIDevStudio } from '../AIDevStudio/AIDevStudio';
import { Prez } from '../Prez/Prez';
import { PrezManifest } from '../Prez/manifest';
import { LocalAI } from '../LocalAI/LocalAI';
import { ChatyAI } from '../ChatyAI/ChatyAI';

export const AVAILABLE_APPS = [
  {
    id: 'localai',
    name: 'Local AI',
    icon: MessageSquare,
    component: LocalAI,
    description: 'Local LLM inference engine with OpenAI-compatible API',
    features: [
      'Local LLM inference using WebLLM',
      'OpenAI-compatible REST API',
      'Built-in chat interface',
      'Multiple model support',
      'Real-time response streaming',
      'System resource monitoring'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
    ],
    category: 'development',
    version: '1.0.0',
    author: 'StackBlitz',
    keywords: ['ai', 'llm', 'inference', 'api'],
    requirements: {
      'Storage': '100MB',
      'Memory': '512MB'
    }
  },
  {
    id: 'chatyai',
    name: 'Chaty AI',
    icon: MessageSquare,
    component: ChatyAI,
    description: 'Local LLM inference engine with chat interface',
    features: [
      'Local LLM inference using WebGPU',
      'Real-time chat interface',
      'Multiple model support',
      'Response streaming',
      'Resource monitoring'
    ],
    screenshots: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
    ],
    category: 'development',
    version: '1.0.0',
    author: 'StackBlitz',
    keywords: ['ai', 'llm', 'chat'],
    requirements: {
      'Storage': '100MB',
      'Memory': '512MB'
    }
  },
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
    }
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
    }
  },
  {
    id: 'textpad',
    name: 'TextPad',
    icon: FileText,
    component: TextPad,
    description: 'A simple text editor for quick notes and coding.',
    category: 'productivity',
    screenshots: ['https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80']
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: Calculator,
    component: CalculatorApp,
    description: 'Basic calculator with standard operations.',
    category: 'utilities',
    screenshots: ['https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400&q=80']
  },
  {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    component: TerminalApp,
    description: 'Command line interface for system operations.',
    category: 'development',
    screenshots: ['https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&q=80']
  }
];
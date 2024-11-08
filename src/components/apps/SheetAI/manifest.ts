//import { AppInfo } from '../../../types/apps';
import { AppInfo } from '@reai/types';
import { FileSpreadsheet } from 'lucide-react';
import { SheetAI } from './SheetAI';

export const SheetAIManifest: AppInfo = {
  id: 'sheetai',
  name: 'SheetAI',
  description: 'Intelligent spreadsheet application with AI-powered features',
  icon: FileSpreadsheet,
  component: SheetAI,
  category: 'productivity',
  version: '1.0.0',
  author: 'StackBlitz',
  width: 1200,
  height: 800,
  canUninstall: true,
  screenshots: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'
  ],
  features: [
    'Advanced spreadsheet functionality',
    'AI-powered formula suggestions',
    'Real-time collaboration',
    'Data visualization with charts',
    'Formula library with common functions',
    'CSV import/export',
    'Cell formatting and styling',
    'Column and row management'
  ],
  keywords: ['spreadsheet', 'excel', 'sheets', 'data', 'ai'],
  requirements: {
    'Storage': '50MB',
    'Memory': '256MB'
  }
};
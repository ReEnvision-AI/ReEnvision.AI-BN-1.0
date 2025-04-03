import { FolderOpen } from 'lucide-react';
import { FileSystemApp } from './FileSystemApp';

const FileSystemManifest = {
  id: 'file-system',
  name: 'Files',
  description: 'Manage your documents, images, and other files',
  icon: 'folderopen',
  type: 'component',
  component: FileSystemApp,
  preferred_width: 1000,
  preferred_height: 700,
  min_width: 600,
  min_height: 400,
  screenshots: ['https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=800&q=80'],
  features: [
    'Document management',
    'Image gallery',
    'File organization',
    'Search functionality',
    'Grid and list views'
  ],
  category: 'Utilities',
  tier: 'base'
};

export default FileSystemManifest;

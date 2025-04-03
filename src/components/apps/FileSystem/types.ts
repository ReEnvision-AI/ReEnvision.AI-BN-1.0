export interface FileSystemItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  mime_type?: string;
  size?: number;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
  is_shared: boolean;
  app_id?: string;
}

export type StorageSection = 'personal' | 'apps' | string;

export interface PreviewModalProps {
  item: FileSystemItem;
  onClose: () => void;
}

import { FolderOpen } from "lucide-react";
import { FileManager } from "./FileManager";

const FileManagerManifest = {
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

export default FileManagerManifest;
import { FileText, FileImage, FileVideo, FileAudio, File as FilePdf, FileCode, FileArchive, FileSpreadsheet } from 'lucide-react';

export const FILE_ICONS = {
  // Documents
  'application/pdf': FilePdf,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.ms-excel': FileSpreadsheet,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
  'application/vnd.ms-powerpoint': FileText,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': FileText,
  'application/rtf': FileText,
  'text/plain': FileText,
  'text/markdown': FileText,
  
  // Images
  'image/jpeg': FileImage,
  'image/png': FileImage,
  'image/gif': FileImage,
  'image/webp': FileImage,
  'image/svg+xml': FileImage,
  'image/bmp': FileImage,
  'image/tiff': FileImage,
  
  // Videos
  'video/mp4': FileVideo,
  'video/webm': FileVideo,
  'video/ogg': FileVideo,
  'video/quicktime': FileVideo,
  'video/x-matroska': FileVideo,
  
  // Audio
  'audio/mpeg': FileAudio,
  'audio/wav': FileAudio,
  'audio/ogg': FileAudio,
  'audio/aac': FileAudio,
  'audio/flac': FileAudio,
  'audio/x-m4a': FileAudio,
  
  // Code
  'text/javascript': FileCode,
  'text/typescript': FileCode,
  'text/html': FileCode,
  'text/css': FileCode,
  'text/xml': FileCode,
  'text/x-python': FileCode,
  'text/x-java': FileCode,
  'text/x-c': FileCode,
  'text/x-cpp': FileCode,
  'application/json': FileCode,
  'application/x-httpd-php': FileCode,
  
  // Archives
  'application/zip': FileArchive,
  'application/x-rar-compressed': FileArchive,
  'application/x-7z-compressed': FileArchive,
  'application/x-tar': FileArchive,
  'application/x-bzip2': FileArchive,
  'application/gzip': FileArchive
};

export const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return FilePdf;
  const Icon = FILE_ICONS[mimeType as keyof typeof FILE_ICONS];
  return Icon || FilePdf;
};

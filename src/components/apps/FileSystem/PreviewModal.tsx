import React, { useState, useEffect } from 'react';
import { X, Maximize2, Download, Upload } from 'lucide-react';
import { TextViewer } from './TextViewer';
import { PreviewModalProps } from './types';
import { getFileIcon } from './FileIcons';
import supabase from '../../../services/supabaseService';
import { useAuthContext } from '../../../context/AuthContext';

export const PreviewModal: React.FC<PreviewModalProps> = ({ item, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [textContent, setTextContent] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const getFileUrl = async () => {
      try {
        // For text files, fetch content directly
        if (item.mime_type?.startsWith('text/') || 
            item.mime_type === 'application/json' ||
            item.mime_type?.includes('javascript') ||
            item.mime_type?.includes('typescript')) {
          const { data } = await supabase.storage
            .from('user-files')
            .download(`${user?.id}${item.path}`);
            
          if (data) {
            const text = await data.text();
            setTextContent(text);
          }
        }

        const { data } = await supabase.storage
          .from('user-files')
          .createSignedUrl(`${user?.id}${item.path}`, 3600);

        if (data?.signedUrl) {
          setUrl(data.signedUrl);
        }
      } catch (err) {
        console.error('Error getting file URL:', err);
      } finally {
        setLoading(false);
      }
    };

    getFileUrl();
  }, [item, user]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className={`bg-gray-900 rounded-lg p-4 w-full flex flex-col transition-all duration-300 ${
        isFullscreen ? 'h-screen max-w-full m-0' : 'max-w-[95vw] w-[1600px] h-[85vh]'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            {React.createElement(getFileIcon(item.mime_type), { className: "w-5 h-5" })} 
            <span>{item.name}</span>
          </h3>
          <div className="flex items-center gap-2">
            <a
              href={url || '#'}
              download={item.name}
              onClick={(e) => {
                e.preventDefault();
                if (!url) {
                  alert('Download link not available');
                  return;
                }
                // Create temporary link and trigger download
                const link = document.createElement('a');
                link.href = url;
                link.download = item.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors 
                min-w-touch min-h-touch touch-manipulation"
              title="Download file"
              onTouchStart={(e) => {
                e.currentTarget.classList.add('bg-gray-800');
              }}
              onTouchEnd={(e) => {
                e.currentTarget.classList.remove('bg-gray-800');
              }}
            >
              <Upload className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden rounded-lg bg-gray-800">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading preview...</div>
            </div>
          ) : url ? (
            item.mime_type?.startsWith('image/') ? (
              <img
                src={url}
                alt={item.name}
                className="w-full h-full object-contain bg-[#18181b]"
              />
            ) : item.mime_type === 'application/pdf' ? (
              <iframe
                src={url}
                className="w-full h-full bg-white"
                title={item.name}
              />
            ) : item.mime_type?.startsWith('video/') ? (
              <video
                src={url}
                controls
                controlsList="nodownload"
                autoPlay
                className="w-full h-full bg-[#18181b]"
                title={item.name}
              />
            ) : item.mime_type?.startsWith('audio/') ? (
              <div className="flex flex-col items-center justify-center h-full bg-[#18181b] p-8">
                <FileAudio className="w-24 h-24 text-gray-400 mb-8" />
                <audio
                  src={url}
                  controls
                  controlsList="nodownload"
                  autoPlay
                  className="w-full max-w-xl"
                  title={item.name}
                />
              </div>
            ) : item.mime_type?.startsWith('text/') ? (
              <TextViewer content={textContent || 'No content available'} fileName={item.name} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400">Preview not available</div>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Failed to load preview</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
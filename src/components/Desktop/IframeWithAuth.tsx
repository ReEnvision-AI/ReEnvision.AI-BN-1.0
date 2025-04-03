import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import supabase from '../../services/supabaseService';
import { RefreshCw } from 'lucide-react';

interface IframeWithAuthProps {
  url: string;
  title: string;
  className?: string;
}

export const IframeWithAuth: React.FC<IframeWithAuthProps> = ({ url, title, className }) => {
  const [iframeUrl, setIframeUrl] = useState<string>(url);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const setupAuth = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          console.error('Error getting session:', error);
          setError('Failed to get authentication session');
          return;
        }

        // Create URL with auth params
        const authUrl = new URL(url);
        
        // Add Supabase configuration
        authUrl.searchParams.append('supabaseUrl', import.meta.env.VITE_SUPA_URL);
        authUrl.searchParams.append('supabaseKey', import.meta.env.VITE_SUPA_PUBLIC_KEY);
        authUrl.searchParams.append('accessToken', session.access_token);
        authUrl.searchParams.append('refreshToken', session.refresh_token ?? '');
        
        // Add user info if needed
        if (user) {
          authUrl.searchParams.append('userId', user.id);
          if (user.email) {
            authUrl.searchParams.append('userEmail', user.email);
          }
        }

        setIframeUrl(authUrl.toString());
      } catch (err) {
        console.error('Error setting up iframe auth:', err);
        setError('Failed to initialize app authentication');
      } finally {
        setLoading(false);
      }
    };

    setupAuth();
  }, [url, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
          <div className="text-gray-300">Loading app...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <iframe
      src={iframeUrl}
      title={title}
      className={className}
      referrerPolicy="no-referrer"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
    />
  );
};

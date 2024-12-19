import React, { useEffect } from 'react';
import { useStore } from '../../store/useWindowStore';
import { AppIcon } from './AppIcon';
import { Taskbar } from './TaskBar';
import { Window } from './Window';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getDefaultApps } from '../../api/apps';
import { useState } from 'react';

export const Desktop: React.FC = () => {
  const default_apps = getDefaultApps();
  const { fetchInstalledApps, installedApps } = useAppStore();
  const { getUser } = useAuthStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const user = getUser();
    if(user)
      fetchInstalledApps(user.id);
  }, [fetchInstalledApps, getUser]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { windows, isAppOen } = useStore();

  const apps = default_apps?.concat(installedApps ? installedApps : []);

  return (
    <div
      className="absolute inset-0 pb-16 pt-safe overflow-hidden"
      style={{
        background: 'linear-gradient(to right bottom, #2D3436, #000428, #004E92, #000428, #2D3436)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className={`
        grid gap-4 p-4
        ${isMobile ? 'grid-cols-4' : 'grid-cols-6'}
      `}
      >
        {(apps ?? []).map((app) => (
          <AppIcon key={app.id} app={app} isMobile={isMobile} />
        ))}
      </div>

      {windows.map((window) => isAppOen(window.app) && <Window key={window.id} window={window} isMobile={isMobile} />)}

      <Taskbar />
    </div>
  );
};

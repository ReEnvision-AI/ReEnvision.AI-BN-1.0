import React, { useEffect } from "react";
import { useStore } from "../../store/useStore";
import { AppIcon } from "./AppIcon";
import { Taskbar } from "./TaskBar";
import { Window } from "./Window";
//import { useInstalledApps } from "../../contexts/useInstalledApps";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { defaultApps } from "../../hooks/useApps";
import { useState } from "react";
//import { useInstalledApps } from "../../hooks/useInstalledApps";

export const Desktop: React.FC = () => {
  const { data: default_apps, isLoading, error } = defaultApps();
  const { fetchInstalledApps, installedApps } = useAppStore();
  const { getUser } = useAuthStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(()=> {
      fetchInstalledApps(getUser().id);
  }, [fetchInstalledApps, getUser]);

  useEffect(()=>{
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('reset', handleResize);
  });

  const { windows } = useStore();

  console.log("Installed apps:", installedApps);

  const apps = default_apps?.concat(installedApps ? installedApps: []);

  if (isLoading) return <div>Loading apps...</div>;
  if (error) return <div>Error loading apps</div>;

  return (
    <div className="absolute inset-0 pb-16 pt-safe overflow-hidden"
    style={{
      background: 'linear-gradient(to right bottom, #2D3436, #000428, #004E92, #000428, #2D3436)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="grid grid-cols-6 gap-4 p-4">
        {(apps ?? []).map((app) => (
          <AppIcon key={app.id} app={app} isMobile={isMobile} />
        ))}
      </div>

      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}
      
      <Taskbar />
    </div>
  );
};

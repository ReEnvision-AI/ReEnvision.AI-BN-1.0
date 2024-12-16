import React, { useEffect } from "react";
import { useStore } from "../../store/useStore";
import { AppIcon } from "./AppIcon";
import { Taskbar } from "./TaskBar";
import { Window } from "./Window";
//import { useInstalledApps } from "../../contexts/useInstalledApps";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { defaultApps } from "../../hooks/useApps";
//import { useInstalledApps } from "../../hooks/useInstalledApps";

export const Desktop: React.FC = () => {
  const { data: default_apps, isLoading, error } = defaultApps();
  const { fetchInstalledApps, installedApps } = useAppStore();
  const { getUser } = useAuthStore();

  useEffect(()=> {
      fetchInstalledApps(getUser().id);
  }, [fetchInstalledApps, getUser]);

  const { windows } = useStore();

  const apps = default_apps?.concat(installedApps ? installedApps: []);

  if (isLoading) return <div>Loading apps...</div>;
  if (error) return <div>Error loading apps</div>;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-900 to-purple-900 overflow-hidden relative">
      <div className="grid grid-cols-6 gap-4 p-4">
        {(apps ?? []).map((app) => (
          <AppIcon key={app.id} app={app} />
        ))}
      </div>

      {windows.map((window) => (
        <Window key={window.id} window={window} />
      ))}
      
      <Taskbar />
    </div>
  );
};

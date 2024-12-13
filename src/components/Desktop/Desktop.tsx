import React from "react";
import { defaultApps } from "../../hooks/useApps";
import { useStore } from "../../store/useStore";
import { AppIcon } from "./AppIcon";
import { Taskbar } from "./TaskBar";
import { Window } from "./Window";

export const Desktop: React.FC = () => {
  const { data: apps, isLoading, error } = defaultApps();
  const { windows } = useStore();

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

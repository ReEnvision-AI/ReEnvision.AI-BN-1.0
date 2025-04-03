import React, { useEffect } from 'react';
import { useStore } from '../../store/useWindowStore';
import { AppIcon } from './AppIcon';
import { Taskbar } from './TaskBar';
import { Window } from './Window';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useDesktopStore } from '../../store/useDesktopStore';
import { DynamicBackground } from './DynamicBackground';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { getDefaultApps } from '../../api/apps';

export const Desktop: React.FC = () => {
  const default_apps = getDefaultApps();
  const { fetchInstalledApps, installedApps } = useAppStore();
  const { getUser } = useAuthStore();
  const { settings, backgrounds, activeBackgroundId } = useDesktopStore();
  const [showWorkspaceName, setShowWorkspaceName] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // Show workspace name when background changes
  useEffect(() => {
    setShowWorkspaceName(true);
    const timer = setTimeout(() => setShowWorkspaceName(false), 750);
    return () => clearTimeout(timer);
  }, [activeBackgroundId]);

  useEffect(() => {
    const user = getUser();
    if(user) {
      fetchInstalledApps(user.id);
    }
  }, [fetchInstalledApps, getUser]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const { windows, isAppOpen } = useStore();

  const apps = default_apps?.concat(installedApps ? installedApps : []);
  const activeBackground = backgrounds.find(bg => bg.id === activeBackgroundId);
  const coreApps = ['file-system', 'f8ad4840-ab66-478b-94dd-412cd9da678c', 'settings'];
  const filteredApps = apps?.filter(app => 
    // Always show core apps (Files, App Store, Settings) plus workspace-specific apps
    coreApps.includes(app.id) ||
    !activeBackground?.appIds.length || 
    activeBackground.appIds.includes(app.id)
  );

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ 
        paddingBottom: settings.taskbarPosition === 'bottom' ? settings.taskbarSize : 0, 
        paddingTop: settings.taskbarPosition === 'top' ? settings.taskbarSize : 0, 
        paddingLeft: settings.taskbarPosition === 'left' ? settings.taskbarSize : 0, 
        paddingRight: settings.taskbarPosition === 'right' ? settings.taskbarSize : 0 
      }} 
    >
      <DynamicBackground style={activeBackground?.style || settings.background} />
      
      {/* Workspace Title */}
      <AnimatePresence>
        {showWorkspaceName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-black/40 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-2xl border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold text-white/90 text-center whitespace-nowrap">
                {activeBackground?.name || 'Default'}
              </h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows Layer */}
      <div className="absolute inset-0">
        {windows.map((window) => isAppOpen(window.app) && (
          <Window 
            key={window.id} 
            windowData={window} 
            isMobile={isMobile} 
            loading={false}
          />
        ))}
      </div>

      {/* Desktop Icons Grid */}
      <div
        className={`
          absolute inset-0 grid auto-rows-min gap-x-4 gap-y-2 p-4 pointer-events-auto content-start
          ${isMobile ? 'grid-cols-4' : 'grid-cols-6'}
        `}
      >
        {(filteredApps ?? []).map((app) => (
          <AppIcon key={app.id} app={app} isMobile={isMobile} />
        ))}
      </div>

      <Taskbar />
    </div>
  );
};

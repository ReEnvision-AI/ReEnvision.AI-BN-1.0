import React, { useRef } from 'react'; // Import useRef
import { useStore } from '../../store/useWindowStore';
import { Power, X, Maximize2 } from 'lucide-react';
import { TaskbarItem } from './TaskBarItem';
import { useAuthContext } from '../../context/AuthContext';
import { ReEnvisionLogo, LowPolySphere } from '../icons/ReEnvisionLogo';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useDesktopStore } from '../../store/useDesktopStore';
import { getDefaultApps } from '../../api/apps';
import { useAppStore } from '../../store/useAppStore';
import { iconMap } from '../utils/iconmap';
import { AnimatePresence, motion } from 'framer-motion';

export const Taskbar: React.FC = () => {
  const { windows, openWindow } = useStore();
  const { signOut, user } = useAuthContext();
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [showMenu, setShowMenu] = React.useState(false);
  const [showWorkspaceName, setShowWorkspaceName] = React.useState(false);
  const { fetchInstalledApps, installedApps } = useAppStore();
  const { settings, cycleBackground, backgrounds, activeBackgroundId } = useDesktopStore();
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const activeBackground = backgrounds.find(bg => bg.id === activeBackgroundId);

  // State for triple-click detection
  const clickCount = useRef(0);
  const clickTimeout = useRef<NodeJS.Timeout | null>(null);
  const TRIPLE_CLICK_DELAY = 500; // milliseconds

  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  React.useEffect(() => {
    if (user) {
      fetchInstalledApps(user.id);
    }
  }, [fetchInstalledApps, user]);

  const defaultApps = getDefaultApps();
  const allApps = defaultApps.concat(installedApps || []);

  const handleLogout = async () => {
    await signOut();
  };

  const handleAppClick = (app: any) => {
    openWindow(app);
    setShowMenu(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle workspace switching
  const handleCycleBackground = () => {
    cycleBackground();
    setShowWorkspaceName(true);
    setTimeout(() => setShowWorkspaceName(false), 2000);
  };

  // Handle center button click (single and triple)
  const handleCenterButtonClick = () => {
    clickCount.current += 1;

    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
    }

    if (clickCount.current === 1) {
      // Start timer for potential multi-click
      clickTimeout.current = setTimeout(() => {
        // If timer expires, it was a single click
        setShowMenu(!showMenu);
        clickCount.current = 0; // Reset count
      }, TRIPLE_CLICK_DELAY);
    } else if (clickCount.current === 3) {
      // Triple click detected
      handleCycleBackground();
      clickCount.current = 0; // Reset count
      if (clickTimeout.current) {
        clearTimeout(clickTimeout.current); // Clear the single click timer
      }
    } else if (clickCount.current > 3) {
      // Reset if more than 3 clicks
      clickCount.current = 0;
    }
  };

  return (
    <div
      className={`fixed transition-all duration-300 backdrop-blur border-gray-700 safe-area-insets
        ${settings.taskbarPosition === 'top' ? 'top-0 left-0 right-0 border-b' : ''}
        ${settings.taskbarPosition === 'bottom' ? 'bottom-0 left-0 right-0 border-t' : ''}
        ${settings.taskbarPosition === 'left' ? 'top-0 bottom-0 left-0 border-r' : ''}
        ${settings.taskbarPosition === 'right' ? 'top-0 bottom-0 right-0 border-l' : ''}
        ${settings.taskbarAutoHide && !isHovered ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
      `}
      style={{
        backgroundColor: `rgba(17, 24, 39, ${settings.taskbarOpacity})`,
        height: settings.taskbarPosition === 'top' || settings.taskbarPosition === 'bottom' ? `${settings.taskbarSize}px` : '100%',
        width: settings.taskbarPosition === 'left' || settings.taskbarPosition === 'right' ? `${settings.taskbarSize}px` : '100%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showMenu && (
        <div
          className="fixed left-1/2 -translate-x-1/2 w-[min(480px,95vw)] bg-gray-900/95 backdrop-blur border border-gray-700 rounded-lg overflow-hidden shadow-xl z-50"
          style={{
            bottom: `calc(${settings.taskbarSize}px + 1rem)`,
            maxHeight: `calc(100vh - ${settings.taskbarSize}px - 2rem)`
          }}
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <ReEnvisionLogo className="w-6 h-6" />
              <span className="text-sm font-medium text-gray-300">ReEnvision AI</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMenu(false)}
                className="p-1 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allApps.map((app) => {
                const Icon = iconMap[app.icon] || iconMap.app;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleAppClick(app)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
                      <Icon className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <span className="text-sm text-gray-300 text-center line-clamp-2">{app.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-3 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-white/10 text-white/90 transition-colors"
            >
              <Power className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
      <div className="flex h-full items-center px-2 relative">
        <div className="absolute inset-0 flex items-center pointer-events-none">
          {/* Left side: Running apps */}
          <div className="flex items-center gap-2 pointer-events-auto ml-2 overflow-x-auto" style={{ width: '33.333%' }}>
            <button
              onClick={toggleFullscreen}
              className={`
                p-2 rounded-lg transition-colors
                hover:bg-gray-800/80 backdrop-blur-sm
                border border-gray-700/50 text-gray-300
                ${isFullscreen ? 'bg-blue-600/20 text-blue-400' : ''}
              `}
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            {windows.map((window) => (
              <TaskbarItem key={window.id} window={window} />
            ))}
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center pointer-events-auto absolute left-1/2 -translate-x-1/2">
            <button
              onClick={handleCenterButtonClick} // Use the new handler
              className={`
                w-14 h-14 hover:bg-white/5 rounded-full
                touch-manipulation cursor-pointer
                flex items-center justify-center
                focus:outline-none focus:ring-2 focus:ring-white/20
                active:bg-white/20 overflow-hidden
                ${showMenu ? 'bg-white/5' : ''}
                group relative
              `}
              aria-label="Open Start Menu / Cycle Workspace (Triple Click)"
            >
              <AnimatePresence>
                {showWorkspaceName && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: -40 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-black/90 rounded-lg whitespace-nowrap"
                  >
                    <span className="text-sm font-medium text-white">{activeBackground?.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />
                <pointLight position={[0, 0, 5]} intensity={0.4} color="#ffffff" />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  minPolarAngle={Math.PI / 2}
                  maxPolarAngle={Math.PI / 2}
                />
                <LowPolySphere />
              </Canvas>
            </button>
          </div>

          {/* Right side: Clock */}
          <div className="flex items-center justify-end gap-2 pointer-events-auto ml-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg">
                <span className="text-sm font-medium text-gray-300">{formattedTime}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 hover:bg-white/10 active:bg-white/20 rounded-lg text-white/90 transition-colors min-w-touch min-h-touch"
                onTouchStart={(e) => {
                  e.currentTarget.classList.add('bg-white/20');
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.classList.remove('bg-white/20');
                  handleLogout();
                }}
                title="Sign Out"
              >
                <Power className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

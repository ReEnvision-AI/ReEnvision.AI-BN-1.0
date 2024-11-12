import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { Rnd } from 'react-rnd';
import { defaultApps } from '../../data/defaultApps';

export function Desktop({ children, windows, setWindows }) {
  //const { settings, installedApps } = useApp();
  const { installedApps } = useApp();
  const [iconPositions, setIconPositions] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [touchStartTime, setTouchStartTime] = useState(0);

  //const gridSize = settings.gridEnabled ? (settings.gridSpacing || 20) : 1;
  const gridSize = 20;
  const iconSize = {
    small: { width: 64, height: 80 },
    medium: { width: 80, height: 96 },
    large: { width: 96, height: 112 }
  //}[settings.iconSize || 'medium'];
  }['medium'];

  const calculateGridLayout = useCallback(() => {
    const columns = Math.floor((window.innerWidth - gridSize) / (iconSize.width + gridSize));
    const maxY = window.innerHeight - 100;
    const newPositions = {};
    
    const occupiedPositions = new Set(
      Object.entries(iconPositions)
        .map(([id, pos]) => `${pos.x},${pos.y}`)
    );

    defaultApps.forEach((app) => {
      if (!iconPositions[app.id]) {
        let row = 0;
        let col = 0;
        let position;

        while (true) {
          const x = col * (iconSize.width + gridSize) + gridSize;
          const y = row * (iconSize.height + gridSize) + gridSize;

          if (y + iconSize.height <= maxY && !occupiedPositions.has(`${x},${y}`)) {
            position = { x, y };
            occupiedPositions.add(`${x},${y}`);
            break;
          }

          col++;
          if (col >= columns) {
            col = 0;
            row++;
          }
        }

        newPositions[app.id] = position;
      }
    });

    return newPositions;
  }, [defaultApps, gridSize, iconSize, iconPositions]);

  useEffect(() => {
    const newPositions = calculateGridLayout();
    if (Object.keys(newPositions).length > 0) {
      setIconPositions(prev => ({
        ...prev,
        ...newPositions
      }));
    }
  }, [calculateGridLayout]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleIconMove = useCallback((id, position) => {
    //if (settings.gridEnabled) {
    if (true) {
      const columns = Math.floor((window.innerWidth - gridSize) / (iconSize.width + gridSize));
      const x = Math.round(position.x / (iconSize.width + gridSize)) * (iconSize.width + gridSize) + gridSize;
      const y = Math.round(position.y / (iconSize.height + gridSize)) * (iconSize.height + gridSize) + gridSize;

      const maxX = columns * (iconSize.width + gridSize);
      const maxY = window.innerHeight - iconSize.height - gridSize - 100;
      const boundedX = Math.max(gridSize, Math.min(x, maxX));
      const boundedY = Math.max(gridSize, Math.min(y, maxY));

      setIconPositions(prev => ({
        ...prev,
        [id]: { x: boundedX, y: boundedY }
      }));
    } else {
      setIconPositions(prev => ({
        ...prev,
        [id]: position
      }));
    }
  }, [/*settings.gridEnabled, */ gridSize, iconSize.width, iconSize.height]);

  const handleContextMenu = useCallback((e, app) => {
    e.preventDefault();
    if (!app.canUninstall) return;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      app
    });
  }, []);

  const openApp = useCallback((app) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const x = Math.max(0, Math.min((screenWidth - app.width) / 2, screenWidth - app.width));
    const y = Math.max(0, Math.min((screenHeight - app.height) / 2, screenHeight - app.height));
    
    const width = Math.min(app.width || 600, screenWidth * 0.9);
    const height = Math.min(app.height || 400, screenHeight * 0.9);

    setWindows(prev => [...prev, {
      id: Date.now(),
      title: app.name,
      content: <app.component />,
      icon: app.icon,
      x,
      y,
      width,
      height
    }]);
  }, [setWindows]);

  const handleTouchStart = useCallback(() => {
    setTouchStartTime(Date.now());
  }, []);

  const handleTouchEnd = useCallback((app, e) => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < 300) {
      openApp(app);
    }
    e.preventDefault();
  }, [touchStartTime, openApp]);

  const visibleApps = defaultApps.filter(app => 
    app.permanent || installedApps?.includes(app)
  );

  return (
    <div 
      className="absolute inset-0 pb-16 pt-safe overflow-hidden"
      style={{
        //background: settings.wallpaper,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
      onClick={() => contextMenu && setContextMenu(null)}
    >
      {visibleApps.map((app) => (
        <Rnd
          key={app.id}
          position={iconPositions[app.id] || { x: gridSize, y: gridSize }}
          size={iconSize}
          onDragStop={(e, d) => handleIconMove(app.id, { x: d.x, y: d.y })}
          //dragGrid={settings.gridEnabled ? [iconSize.width + gridSize, iconSize.height + gridSize] : [1, 1]}
          dragGrid={[iconSize.width + gridSize, iconSize.height + gridSize]}
          bounds="parent"
          enableResizing={false}
          className="touch-none"
        >
          <div
            className={`
              flex flex-col items-center justify-center p-2 rounded-lg
              hover:bg-white/10 active:bg-white/20 transition-colors cursor-default
              ${isMobile ? 'scale-mobile touch-feedback' : ''}
            `}
            onDoubleClick={() => openApp(app)}
            onContextMenu={(e) => handleContextMenu(e, app)}
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => handleTouchEnd(app, e)}
          >
            <app.icon 
              className="text-white mb-1"
              style={{
                width: iconSize.width * 0.5,
                height: iconSize.width * 0.5,
                //color: settings.iconColor || '#FFFFFF'
                color: '#FFFFFF'
              }}
            />
            <span className={`
              text-white text-center break-words line-clamp-2 truncate max-w-[70px]
              ${isMobile ? 'text-dynamic-sm' : 'text-xs'}
            `}>
              {app.name}
            </span>
          </div>
        </Rnd>
      ))}
      {children}
    </div>
  );
}
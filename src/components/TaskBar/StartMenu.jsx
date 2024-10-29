import { MenuItem } from './MenuItem';

export function StartMenu({ apps, onLaunchApp }) {
  return (
    <div className="absolute bottom-16 left-0 w-64 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-t-lg p-2 z-50">
      <div className="grid gap-1">
        {apps.map(app => (
          <MenuItem 
            key={app.id}
            name={app.name}
            icon={app.icon}
            onClick={() => onLaunchApp(app)}
          />
        ))}
      </div>
    </div>
  );
}
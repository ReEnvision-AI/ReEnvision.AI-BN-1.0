import { Folder, HardDrive, Image, Music, FileText } from 'lucide-react';

export function SideBar({ onNavigate, currentPath }) {
  const locations = [
    { 
      name: 'Home',
      path: '/home/demo',
      icon: HardDrive 
    },
    { 
      name: 'Documents',
      path: '/home/demo/Documents',
      icon: FileText 
    },
    { 
      name: 'Pictures',
      path: '/home/demo/Pictures',
      icon: Image 
    },
    { 
      name: 'Music',
      path: '/home/demo/Music',
      icon: Music 
    }
  ];

  return (
    <div className="w-48 bg-gray-800/50 p-2 space-y-1">
      {locations.map(({ name, path, icon: Icon }) => (
        <button
          key={path}
          onClick={() => onNavigate(path)}
          className={`
            w-full flex items-center gap-2 p-2 rounded-lg
            ${currentPath === path ? 'bg-blue-600' : 'hover:bg-gray-700/50'}
            text-gray-200
          `}
        >
          <Icon className="w-4 h-4" />
          <span className="text-sm">{name}</span>
        </button>
      ))}
    </div>
  );
}
import React from 'react';
import type { App } from '../../types';
import { AppWindow, Calculator, FileText, Store } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface AppIconProps {
    app: App;
}

const iconMap = {
    'calculator': Calculator,
    'file-text': FileText,
    'store': Store,
};

export const AppIcon: React.FC<AppIconProps> = ({app}) => {
    const {openWindow} = useStore();
    const Icon = iconMap[app.icon as keyof typeof iconMap] ? iconMap[app.icon as keyof typeof iconMap] : AppWindow;

    const handleOpen = () => {
        console.log("About to open", app);
        openWindow(app);
    }

    return (
        <div
           className='flex flex-col items-center p-4 rounded-lg hover:bg-white/10 cursor-pointer transition-colors'
           onDoubleClick={handleOpen}
        >
          <Icon className='w-12 h=12 text-white' />
          <span className='mt-2 text-sm text-white'>{app.name}</span>
        </div>
    ) 
}
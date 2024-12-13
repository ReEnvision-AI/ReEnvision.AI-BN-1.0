import React from 'react';
import { useStore } from '../../store/useStore';
//import { supabase } from '../api/supabase-client';
import supabase from '../../services/supabaseService';
//import { PowerOff } from '@tamagui/lucide-icons';
import { PowerOff } from 'lucide-react';
import { TaskbarItem } from './TaskBarItem';

export const Taskbar: React.FC = () => {
  const { windows } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-800/80 backdrop-blur-sm flex items-center justify-between">
      <div className="flex items-center">
        {windows.map((window) => (
          <TaskbarItem key={window.id} window={window} />
        ))}
      </div>
      <button type="button" onClick={handleLogout}><PowerOff></PowerOff></button>
      
    </div>
  );
};
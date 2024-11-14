import React, { createContext, useContext, useEffect, useState } from "react";
import { getSetting, setSetting } from "../utils/settingsdb";
import supbase from '../services/supabaseService';

interface UserSettingsContextType {
    settings: Record<string, any>;
    updateSetting: (key: string, value: any) => Promise<void>;
}

const UserSetttingsContext = createContext<UserSettingsContextType | undefined>(undefined);

const defaultSettings = {
    theme: 'dark',
    language: 'en',
    wallpaper: 'linear-gradient(to right bottom, #2D3436, #000428, #004E92, #000428, #2D3436)',
    username: 'demo',
    iconSize: 'medium',
    gridSpacing: 20,
    gridEnabled: true,
    iconColor: '#FFFFFF'
  };

async function syncSettingsToServer(settings: Record<string, any>) {
    const c = await supbase.from('settings').select('blob');
    console.log("syncsettingstoserver: ", c, JSON.stringify(settings));
}

async function syncSettingsFromServer(): Promise<void> {
    const c = await supbase.from('settings').select('blob');
    console.log("syncSettingsFromServer: ", c);
}

export const UserSettingsProvider = ( {children} : {children: React.ReactNode} ) => {
    const [settings, setSettings] = useState<Record<string, any>>({});

    useEffect(()=>{
        async function loadSettings() {
            await syncSettingsFromServer();
            const theme = await getSetting('theme') || defaultSettings.theme;
            const language = await getSetting('language') || defaultSettings.language;
            const username = await getSetting('username') || defaultSettings.username;
            const wallpaper = await getSetting('wallpaper') || defaultSettings.wallpaper;
            const iconSize = await getSetting('iconSize') || defaultSettings.iconSize;
            const gridSpacing = await getSetting('gridSpacing') || defaultSettings.gridSpacing;
            const gridEnabled = await getSetting('gridEnabled') || defaultSettings.gridEnabled;
            const iconColor = await getSetting('iconColor') || defaultSettings.iconColor;
            setSettings({theme, language, username, wallpaper, iconSize, gridSpacing, gridEnabled, iconColor})
        }

        loadSettings();
    }, []);

    useEffect(() => {
        const handleUnload = async () => {
            await syncSettingsToServer(settings);
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
        };
    }, [settings]);

    const updateSetting = async (key: string, value: any) => {
        await setSetting(key, value);
        setSettings(prev => ({...prev, [key]: value}));
    };

    return (
        <UserSetttingsContext.Provider value={{ settings, updateSetting}}>
            { children }
        </UserSetttingsContext.Provider>
    );
};

export const useUserSettings = () => {
    const context = useContext(UserSetttingsContext);
    if (!context) {
        throw new Error('useUserSettings must be used within a UserSettingsProvider')
    }

    return context;
}
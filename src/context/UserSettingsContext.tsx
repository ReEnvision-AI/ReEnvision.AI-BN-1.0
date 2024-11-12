import React, { createContext, ReactNode, useContext, useState } from "react";



interface UserSettings {
    theme: string;
    wallpaper: string;
    username: string;
    iconSize: string;
    gridSpacing: number;
    gridEnabled: boolean;
    iconColor: string;
}

interface UserSettingsContextType {
    settings: UserSettings;
    setSettings: (settings: UserSettings) => void;
    theme: () => string;
    setTheme: (theme: string) => void;
    wallpaper: () => string;
    setWallpaper: (wallpaper: string) => void;
    username: () => string;
    setUsername: (username: string) => void;
    iconSize: () => string;
    setIconSize: (iconSize: string) => void;
    gridSpacing: () => number;
    setGridSpacing: (gridSpacing: number) => void;
    gridEnabled: () => boolean;
    setGridEnabled: (isGridEnabled: boolean) => void;
    iconColor: () => string;
    setIconColor: (iconColor: string) => void;
}

const defaultSettings: UserSettings = {
    theme: 'dark',
    wallpaper: 'linear-gradient(to right bottom, #2D3436, #000428, #004E92, #000428, #2D3436)',
    username: 'demo',
    iconSize: 'medium',
    gridSpacing: 20,
    gridEnabled: true,
    iconColor: '#FFFFFF'
  };

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsContextProvider = ({children}: {children: ReactNode}) => {
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);

    const theme = () => settings.theme;

    const setTheme = (newTheme) => {
        settings.theme = newTheme;
        setSettings(settings);
    }

    const wallpaper = () => settings.wallpaper;

    const setWallpaper = (newWallpaper) => {
        settings.wallpaper = newWallpaper;
        setSettings(settings);
    }

    const username = () => settings.username;

    const setUsername = (newUsername) => {
        settings.username = newUsername;
        setSettings(settings);
    }

    const iconSize = () => settings.iconSize;

    const setIconSize = (newIconSize: string) => {
        settings.iconSize = newIconSize;
        setSettings(settings);
    }

    const gridSpacing = () => settings.gridSpacing;

    const setGridSpacing = (newGridSpacing: number) => {
        settings.gridSpacing = newGridSpacing;
        setSettings(settings);
    }

    const gridEnabled = () => settings.gridEnabled;

    const setGridEnabled = (isGridEnabled: boolean) => {
        settings.gridEnabled = isGridEnabled;
        setSettings(settings);
    }

    const iconColor = () => settings.iconColor;

    const setIconColor = (newIconColor) => {
        settings.iconColor = newIconColor;
        setSettings(settings);
    }

    return (
        <UserSettingsContext.Provider value={{ settings, setSettings, theme, setTheme, wallpaper, setWallpaper, username, setUsername, iconSize, setIconSize, gridSpacing, setGridSpacing, gridEnabled, setGridEnabled, iconColor, setIconColor }}>
            {children}
        </UserSettingsContext.Provider>
    )
};

export const useUserSettings = (): UserSettingsContextType => {
    const context = useContext(UserSettingsContext);
    if (!context ) {
        throw new Error('useUserSettings must be used within a UserSettingsContextProvider');
    }
    
    return context;
}
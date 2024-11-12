import { useState } from "react";
import { createContext } from "react";
import { AVAILABLE_APPS } from "../components/apps/AppStore/apps-data";
import { useContext } from "react";

const AppContext = createContext([]);

export const AppContextProvider = ({children}) => {
    const [installedApps, setInstalledApps] = useState([]);

    const installApp = (app) => {
        setInstalledApps([...installedApps, app]);
    }

    const uninstallApp = ( app ) => {
        const apps = installedApps;
        const index = apps.indexOf(app);
        if (index > -1 ) {
            apps.splice(index, 1);
            setInstalledApps(apps);
        }
    }

    const availableApps = () => {
        return AVAILABLE_APPS;
    }

    return (
        <AppContext.Provider value={{installedApps, setInstalledApps, uninstallApp, installApp, availableApps }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }

    return context;
}
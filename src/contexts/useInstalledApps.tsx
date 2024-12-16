import React, { createContext, ReactNode, useContext, useMemo } from "react";
import supabase from "../services/supabaseService";
import { App } from "../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface InstalledAppContextType {
    isLoading: boolean;
    error: Error | null;
    installApp: (app_id: string) => Promise<void>;
    uninstallApp: (app_id: string) => void;
    installedApps: App[]| undefined;
}

const InstalledAppsContext = createContext<InstalledAppContextType | undefined>(undefined);

export const useInstalledApps = () => {
    const context = useContext(InstalledAppsContext);
    if (!context) {
        throw new Error("useInstalledApps must be used within a InstalledAppsProvider")
    }

    return context;
}

export const InstalledAppsProvider = ({ children, userId}: {children: ReactNode | ReactNode[], userId: string}) => {
    const queryClient = useQueryClient();

    const { data: installedApps, isLoading, error} = useQuery({
        queryKey: ["installed_apps"],
        queryFn: async () => {
            const query = supabase.from('user_apps').select('installable_apps(*)').eq('user_id', userId);

            const { data, error } = await query;
            if(error) {
                console.error("Error retrieving user installed apps:", error);
                throw error;
            }

            const apps = data.map(item=> item.installable_apps);

            return apps;
        },
        enabled: !!userId
    });

    const updateInstalledAppsMutation = useMutation({
        mutationKey: ["installApp"],
        mutationFn: async (app_id: string) => {
            const {data, error} = await supabase.from('user_apps').insert({user_id: userId, app_id:app_id});
            if (error) {
                throw error;
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['installed_apps']})
        }
    })

    const installApp = async (app_id: string) => {
        await updateInstalledAppsMutation.mutateAsync(app_id);
    }

    const uninstallAppMutation = useMutation({
        mutationKey: ["uninstallApp"],
        mutationFn: async (app_id: string) => {
            const { error } = await supabase.from('user_apps').delete().eq('user_id', userId).eq('app_id', app_id);
            if (error) {
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['installed_apps']})
        }
    })

    const uninstallApp = (app_id: string) => {
        console.log("Uninstalling app:", app_id);
        uninstallAppMutation.mutate(app_id);
    }

    const value = useMemo(
        () => ({
            installedApps,
            isLoading,
            error,
            installApp,
            uninstallApp
        }),
        [installedApps, isLoading, error]
    );

    return <InstalledAppsContext.Provider value={value}>{children}</InstalledAppsContext.Provider>
}
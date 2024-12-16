import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '../services/supabaseService';
import { QueryData } from '@supabase/supabase-js';



export function useInstalledApps() {
    const queryClient = useQueryClient();

    ///const { data: { user }} = await supabase.auth.getUser();
    //supabase.auth.getUser
    //const USER_ID = user ? user.id : null; 

    const getInstalledApps = useQuery({
        queryKey: ["installedApps"],
        queryFn: async () => {
            console.log("getting the installed apps");
            const query = supabase.from('user_apps').select('installable_apps(*)').eq('id', globalThis.user_id);

            type InstalledApps = QueryData<typeof query>

            const { data, error } = await query;
            if(error) {
                console.error("Error retrieving user installed apps:", error);
                throw error;
            }

            const installedApps: InstalledApps = data;

            return installedApps;
        }
    })

    const installApp = useMutation({
        mutationFn: async (app_id: string) => {
            console.log("installing the app", app_id);
            const {data, error } = await supabase.from('user_apps').insert({id: globalThis.user_id, app_id: app_id});

            if (error) {
                console.error("Error setting user installed app:", error);
                throw error;
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['installedApps']})
        }
    })

    const uninstallApp = useMutation({
        mutationFn: async (app_id: string) => {
            console.log("removing the app", app_id);
            const {error} = await supabase.from('user_apps').delete().eq('id', globalThis.user_id).eq('app_id', app_id);

            if (error) {
                console.error("Error uninstalling app:", error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['installedApps']})
        }
    });

    return {
        installedApps: getInstalledApps.data,
        isLoading: getInstalledApps.isLoading,
        isError: getInstalledApps.isError,
        error: getInstalledApps.error,

        install: installApp.mutate,
        uninstall: uninstallApp.mutate,

        isInstalling: installApp.isPending,
        isUninstalling: uninstallApp.isPending
    }
}
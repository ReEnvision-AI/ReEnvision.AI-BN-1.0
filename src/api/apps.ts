import React from "react";
import supabase from "../services/supabaseService";

const { data: { user }} = await supabase.auth.getUser();
const USER_ID = user ? user.id : null;

export type App = {
  id: string;
  name: string;
  icon: string;
  type?: string;
  component?: typeof React.Fragment;
  url?: string;
  preferred_width?: number;
  preferred_height?: number;
  min_width?: number;
  min_height?: number;
}

const DEFAULT_APPS: App[] = [
  {
    id: "f8ad4840-ab66-478b-94dd-412cd9da678c",
    name: "App Store",
    icon: "store",
    type: "component",
    //url: "https://reai-apps.vercel.app/calculator",
    component: React.lazy(() => import("../components/apps/AppStore/AppStore")),
    //component_path: null,
    preferred_width: 570,
    preferred_height: 840,
  },
];

export async function fetchDefaultApps() : Promise<App[]> {
  //const { data, error } = await supabase
  //  .from("default_apps")
  //  .select("*")
  //  .order("created_at");
  //
  //if ( error ) throw error;

  //return InternalAppSchema.array().parse(DEFAULT_APPS);
  return DEFAULT_APPS;
}

export async function fetchInstallableApps() : Promise<App[]>{
  const { data: installable_apps, error } = await supabase
  .from('installable_apps')
  .select('*');

  if (error) {
    console.error("Error retrieving available apps:", error);
    throw error;
  }

  return installable_apps;
}

export async function fetchInstalledApps() : Promise<App[]> {
  const { data: installedApps, error } = await supabase.from('user_apps').select('*').eq('id', USER_ID);

  if (error) {
    console.error("Error retrieving apps for the user:", error);
    throw error;
  }
  return installedApps
}

export async function installApp(app_id) {
  const {data, error} = await supabase.from('user_apps').insert([
    {
      id: USER_ID,
      app_id: app_id
    }
  ])

  if (error) {
    console.error("Error installing app for the user:", error);
    throw error;
  }

  return data;
}

export async function uninstallApp(app_id) {
  const { error } = await supabase.from('user_apps').delete().eq('app_id', app_id).eq('id', USER_ID);
  
  if(error) {
    console.error("Error uninstalling app for the user:", error);
    throw error;
  }
}

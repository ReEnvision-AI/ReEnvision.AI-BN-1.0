import { useQuery } from "@tanstack/react-query";
import { fetchDefaultApps, fetchInstallableApps, installApp as install} from "../api/apps";

export function defaultApps() {
  return useQuery({
    queryKey: ["default_apps"],
    queryFn: fetchDefaultApps,
  });
}

export function availableApps() {
  return useQuery({
    queryKey: ["all_apps"],
    queryFn: fetchInstallableApps
  });
}

export function installApp(app_id: string) {
  return useQuery({
    queryKey: ["install_app", app_id],
    queryFn: () => install(app_id)
  })
}


import { useQuery } from "@tanstack/react-query";
import { fetchDefaultApps, fetchInstallableApps} from "../api/apps";

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

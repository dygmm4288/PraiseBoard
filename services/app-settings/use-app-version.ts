import { useQuery } from "@tanstack/react-query";
import { appSettingsApi } from "./app-settings.api";
import {
  getAppRuntimeInfo,
  resolveAppUpdateStatus,
  type AppUpdateStatus,
} from "./app-version";

export type AppVersionQueryStatus =
  | AppUpdateStatus
  | "checking"
  | "unavailable";

const APP_SETTINGS_QUERY_KEY = ["app-settings"] as const;

export const useAppVersion = () => {
  const runtimeInfo = getAppRuntimeInfo();
  const query = useQuery({
    queryKey: APP_SETTINGS_QUERY_KEY,
    queryFn: appSettingsApi.getAppSettings,
    staleTime: 1000 * 60 * 10,
  });

  let status: AppVersionQueryStatus = "checking";

  if (query.error || (!query.isLoading && !query.data)) {
    status = "unavailable";
  } else if (query.data) {
    status = resolveAppUpdateStatus({
      currentVersion: runtimeInfo.currentVersion,
      latestVersion: query.data.latest_version,
      minimumVersion: query.data.min_version,
    });
  }

  return {
    currentVersion: runtimeInfo.currentVersion,
    status,
    shouldOpenStore: status === "available" || status === "required",
  };
};

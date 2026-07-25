export { appSettingsApi } from "./app-settings.api";
export {
  AppStoreOpenError,
  getAppRuntimeInfo,
  openAppStore,
  resolveAppUpdateStatus,
  resolveStoreUrls,
} from "./app-version";
export type {
  AppPlatform,
  AppRuntimeInfo,
  AppUpdateStatus,
} from "./app-version";
export type { AppSettings } from "./model/app-settings.interface";
export { useAppVersion } from "./use-app-version";
export type { AppVersionQueryStatus } from "./use-app-version";

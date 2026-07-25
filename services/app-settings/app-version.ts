import { compareVersions } from "@/shared/utils/version";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { Linking, Platform } from "react-native";

export type AppPlatform = "ios" | "android" | "web";

export type AppRuntimeInfo = {
  appName: string;
  applicationId: string | null;
  currentVersion: string;
  iosAppStoreId: string | null;
  platform: AppPlatform;
};

export type AppUpdateStatus = "current" | "available" | "required";

const getAppPlatform = (): AppPlatform => {
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return Platform.OS;
  }

  return "web";
};

const getConfiguredApplicationId = (platform: AppPlatform) => {
  if (platform === "ios") {
    return Constants.expoConfig?.ios?.bundleIdentifier ?? null;
  }

  if (platform === "android") {
    return Constants.expoConfig?.android?.package ?? null;
  }

  return null;
};

export const getAppRuntimeInfo = (): AppRuntimeInfo => {
  const platform = getAppPlatform();

  return {
    appName: Constants.expoConfig?.name ?? "PraiseBoard",
    applicationId:
      Application.applicationId ?? getConfiguredApplicationId(platform),
    currentVersion:
      Application.nativeApplicationVersion ??
      Constants.expoConfig?.version ??
      "0.0.0",
    iosAppStoreId: process.env.EXPO_PUBLIC_IOS_APP_STORE_ID ?? null,
    platform,
  };
};

export const resolveAppUpdateStatus = ({
  currentVersion,
  latestVersion,
  minimumVersion,
}: {
  currentVersion: string;
  latestVersion: string;
  minimumVersion: string;
}): AppUpdateStatus => {
  if (compareVersions(currentVersion, minimumVersion) < 0) {
    return "required";
  }

  if (compareVersions(currentVersion, latestVersion) < 0) {
    return "available";
  }

  return "current";
};

const normalizeIosAppStoreId = (value: string | null) => {
  if (!value) return null;

  const normalized = value.replace(/^id/i, "").trim();
  return /^\d+$/.test(normalized) ? normalized : null;
};

export const resolveStoreUrls = ({
  appName,
  applicationId,
  iosAppStoreId,
  platform,
}: AppRuntimeInfo): string[] => {
  if (platform === "ios") {
    const appStoreId = normalizeIosAppStoreId(iosAppStoreId);

    if (appStoreId) {
      return [
        `itms-apps://apps.apple.com/app/id${appStoreId}`,
        `https://apps.apple.com/app/id${appStoreId}`,
      ];
    }

    return [
      `https://apps.apple.com/search?term=${encodeURIComponent(appName)}`,
    ];
  }

  if (platform === "android" && applicationId) {
    return [
      `market://details?id=${encodeURIComponent(applicationId)}`,
      `https://play.google.com/store/apps/details?id=${encodeURIComponent(
        applicationId,
      )}`,
    ];
  }

  if (platform === "android") {
    return [
      `https://play.google.com/store/search?q=${encodeURIComponent(
        appName,
      )}&c=apps`,
    ];
  }

  return [
    `https://www.google.com/search?q=${encodeURIComponent(
      `${appName} app store`,
    )}`,
  ];
};

export class AppStoreOpenError extends Error {
  constructor(options: { cause: unknown }) {
    super("Failed to open the app store.", options);
    this.name = "AppStoreOpenError";
  }
}

export const openAppStore = async (
  runtimeInfo = getAppRuntimeInfo(),
  openUrl: (url: string) => Promise<unknown> = Linking.openURL,
) => {
  let lastError: unknown;

  for (const storeUrl of resolveStoreUrls(runtimeInfo)) {
    try {
      await openUrl(storeUrl);
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw new AppStoreOpenError({ cause: lastError });
};

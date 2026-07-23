import { ensureAndroidChannels } from "@/infra/notification/channel";
import { localStorage } from "@/infra/storage";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  PushTokenDebugInfo,
  PushPermissionStatus,
} from "../model/notification.interface";
import { notificationApi } from "../notification.api";
import { resolveNotificationSettingsState } from "../notification.policy";

const getDeviceIdentity = async () => {
  const [profileId, deviceId] = await Promise.all([
    localStorage.getItem("profile_id"),
    localStorage.getItem("device_id"),
  ]);

  if (!profileId) {
    throw new Error("profile_id is required to save notification permission.");
  }

  if (!deviceId) {
    throw new Error("device_id is required to save notification permission.");
  }

  return { profileId, deviceId };
};

const resolvePlatform = () => {
  if (Platform.OS === "ios") return "ios" as const;
  if (Platform.OS === "android") return "android" as const;
  return "web" as const;
};

const resolvePermissionStatus = (status: string): PushPermissionStatus => {
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  return "undetermined";
};

const hasRuntimeAndroidFcmConfig = () => {
  if (Platform.OS !== "android") return true;

  return Boolean(Constants.expoConfig?.android?.googleServicesFile);
};

const savePushState = async ({
  pushEnabled,
  pushToken,
  permissionStatus,
}: {
  pushEnabled: boolean;
  pushToken: string | null;
  permissionStatus: PushPermissionStatus;
}) => {
  const { profileId, deviceId } = await getDeviceIdentity();
  const currentState = await notificationApi.getPushState(
    profileId,
    deviceId,
  );
  const now = new Date().toISOString();

  await notificationApi.savePushToken({
    profileId,
    deviceId,
    pushToken,
    pushEnabled,
    pushEnabledUpdatedAt:
      currentState.pushEnabled === pushEnabled
        ? currentState.pushEnabledUpdatedAt
        : now,
    platform: resolvePlatform(),
    pushPermissionStatus: permissionStatus,
    pushPermissionGrantedAt:
      permissionStatus === "granted"
        ? (currentState.pushPermissionGrantedAt ?? now)
        : currentState.pushPermissionGrantedAt,
    pushPermissionUpdatedAt:
      currentState.pushPermissionStatus === permissionStatus
        ? currentState.pushPermissionUpdatedAt
        : now,
  });
};

const getExpoPushToken = async () => {
  if (Platform.OS === "web") return null;

  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    console.warn("푸시 토큰 발급을 위한 EAS projectId를 찾을 수 없습니다.");
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch (error) {
    console.warn("푸시 토큰 발급에 실패했습니다.", error);
    return null;
  }
};

const getPushTokenDebugInfo = async (): Promise<PushTokenDebugInfo> => {
  const permissions = await Notifications.getPermissionsAsync();
  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId ??
    null;

  if (Platform.OS === "web") {
    return {
      platform: "web",
      projectId,
      hasAndroidFcmConfig: hasRuntimeAndroidFcmConfig(),
      permissionStatus: resolvePermissionStatus(permissions.status),
      token: null,
      errorMessage: "web platform does not support Expo push token.",
    };
  }

  if (!projectId) {
    return {
      platform: resolvePlatform(),
      projectId,
      hasAndroidFcmConfig: hasRuntimeAndroidFcmConfig(),
      permissionStatus: resolvePermissionStatus(permissions.status),
      token: null,
      errorMessage: "EAS projectId를 찾을 수 없습니다.",
    };
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });

    return {
      platform: resolvePlatform(),
      projectId,
      hasAndroidFcmConfig: hasRuntimeAndroidFcmConfig(),
      permissionStatus: resolvePermissionStatus(permissions.status),
      token: token.data,
      errorMessage: null,
    };
  } catch (error) {
    return {
      platform: resolvePlatform(),
      projectId,
      hasAndroidFcmConfig: hasRuntimeAndroidFcmConfig(),
      permissionStatus: resolvePermissionStatus(permissions.status),
      token: null,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
};

const requestPermissionAndSave = async () => {
  await ensureAndroidChannels();

  const currentPermissions = await Notifications.getPermissionsAsync();
  let status = currentPermissions.status;

  if (status === "undetermined") {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    status = requestedPermissions.status;
  }

  if (status !== "granted") {
    await savePushState({
      pushEnabled: false,
      pushToken: null,
      permissionStatus: resolvePermissionStatus(status),
    });
    return false;
  }

  const pushToken = await getExpoPushToken();
  await savePushState({
    pushEnabled: true,
    pushToken,
    permissionStatus: "granted",
  });
  return pushToken !== null;
};

export const notification = {
  async bootstrap() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    await ensureAndroidChannels();
  },
  async requestPermissionFromOnboarding(): Promise<boolean> {
    return requestPermissionAndSave();
  },
  async getPushEnabledFromSettings() {
    const { profileId, deviceId } = await getDeviceIdentity();
    return notificationApi.getPushEnabled(profileId, deviceId);
  },
  async getPushStateFromSettings() {
    const { profileId, deviceId } = await getDeviceIdentity();
    return notificationApi.getPushState(profileId, deviceId);
  },
  async getSettingsState() {
    const [{ profileId, deviceId }, permissions] = await Promise.all([
      getDeviceIdentity(),
      Notifications.getPermissionsAsync(),
    ]);
    const pushState = await notificationApi.getPushState(profileId, deviceId);

    return resolveNotificationSettingsState(
      pushState,
      resolvePermissionStatus(permissions.status),
    );
  },
  async getPushTokenDebugInfo() {
    return getPushTokenDebugInfo();
  },
  async setPushEnabledFromSettings(enabled: boolean) {
    if (!enabled) {
      const permissions = await Notifications.getPermissionsAsync();

      await savePushState({
        pushEnabled: false,
        pushToken: null,
        permissionStatus: resolvePermissionStatus(permissions.status),
      });
      return;
    }

    await requestPermissionAndSave();
  },
  async syncPushToken() {
    await ensureAndroidChannels();

    const { profileId, deviceId } = await getDeviceIdentity();
    const currentState = await notificationApi.getPushState(
      profileId,
      deviceId,
    );
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== "granted") {
      await savePushState({
        pushEnabled: false,
        pushToken: null,
        permissionStatus: resolvePermissionStatus(permissions.status),
      });
      return;
    }

    const pushToken = currentState.pushEnabled
      ? await getExpoPushToken()
      : null;
    await savePushState({
      pushEnabled: currentState.pushEnabled,
      pushToken,
      permissionStatus: "granted",
    });
  },
};

import { localStorage } from "@/infra/storage";
import { notificationApi } from "@/services/notification/notification.api";
import type {
  PushPermissionStatus,
  PushPlatform,
  PushState,
  TestPushResult,
} from "@/services/notification/model/notification.interface";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export type PushTokenDebugInfo = {
  platform: PushPlatform;
  projectId: string | null;
  hasAndroidFcmConfig: boolean;
  permissionStatus: PushPermissionStatus;
  token: string | null;
  errorMessage: string | null;
};

export type NotificationDebugSnapshot = {
  profileId: string | null;
  deviceId: string | null;
  osPermissionStatus: string;
  pushState: PushState | null;
};

const getDebugDeviceIdentity = async () => {
  const [profileId, deviceId] = await Promise.all([
    localStorage.getItem("profile_id"),
    localStorage.getItem("device_id"),
  ]);

  if (!profileId || !deviceId) {
    throw new Error("테스트 푸시를 보낼 프로필과 기기 정보가 없습니다.");
  }

  return { profileId, deviceId };
};

const resolvePlatform = (): PushPlatform => {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
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

const getProjectId = () =>
  Constants.easConfig?.projectId ??
  Constants.expoConfig?.extra?.eas?.projectId ??
  null;

export const getNotificationDebugSnapshot =
  async (): Promise<NotificationDebugSnapshot> => {
    const [profileId, deviceId, permissions] = await Promise.all([
      localStorage.getItem("profile_id"),
      localStorage.getItem("device_id"),
      Notifications.getPermissionsAsync(),
    ]);

    const pushState =
      profileId && deviceId
        ? await notificationApi
            .getPushState(profileId, deviceId)
            .catch(() => null)
        : null;

    return {
      profileId,
      deviceId,
      osPermissionStatus: permissions.status,
      pushState,
    };
  };

export const getPushTokenDebugInfo =
  async (): Promise<PushTokenDebugInfo> => {
    const permissions = await Notifications.getPermissionsAsync();
    const projectId = getProjectId();
    const baseInfo = {
      platform: resolvePlatform(),
      projectId,
      hasAndroidFcmConfig: hasRuntimeAndroidFcmConfig(),
      permissionStatus: resolvePermissionStatus(permissions.status),
    };

    if (Platform.OS === "web") {
      return {
        ...baseInfo,
        token: null,
        errorMessage: "web platform does not support Expo push token.",
      };
    }

    if (!projectId) {
      return {
        ...baseInfo,
        token: null,
        errorMessage: "EAS projectId를 찾을 수 없습니다.",
      };
    }

    try {
      const token = await Notifications.getExpoPushTokenAsync({ projectId });

      return {
        ...baseInfo,
        token: token.data,
        errorMessage: null,
      };
    } catch (error) {
      return {
        ...baseInfo,
        token: null,
        errorMessage: error instanceof Error ? error.message : String(error),
      };
    }
  };

export const sendTestPushToCurrentDevice =
  async (): Promise<TestPushResult> => {
    const { profileId, deviceId } = await getDebugDeviceIdentity();
    return notificationApi.sendTestPush(profileId, deviceId);
  };

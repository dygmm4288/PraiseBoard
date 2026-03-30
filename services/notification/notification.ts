import { localStorage } from "@/infra/storage";
import { ensureAndroidChannels } from "@/infra/notification/channel";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import {
  INotificationService,
  PushPermissionStatus,
} from "./notification.interface";
import { notificationRepository } from "./notification.repository.impl";

const getDeviceId = async () => {
  const deviceId = await localStorage.getItem("device_id");
  if (!deviceId) {
    throw new Error("device_id is required to save notification permission.");
  }
  return deviceId;
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

const savePushState = async ({
  pushEnabled,
  pushToken,
  permissionStatus,
}: {
  pushEnabled: boolean;
  pushToken: string | null;
  permissionStatus: PushPermissionStatus;
}) => {
  const deviceId = await getDeviceId();
  const currentState = await notificationRepository.getPushState(deviceId);
  const now = new Date().toISOString();

  await notificationRepository.savePushToken({
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
        ? currentState.pushPermissionGrantedAt ?? now
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
    Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId;

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

const requestPermissionAndSave = async () => {
  await ensureAndroidChannels();

  const currentPermissions = await Notifications.getPermissionsAsync();
  let status = currentPermissions.status;

  if (status !== "granted") {
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
  return true;
};

export const notification: INotificationService = {
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
    const deviceId = await getDeviceId();
    return notificationRepository.getPushEnabled(deviceId);
  },
  async setPushEnabledFromSettings(enabled) {
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

    const deviceId = await getDeviceId();
    const currentState = await notificationRepository.getPushState(deviceId);
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== "granted") {
      await savePushState({
        pushEnabled: false,
        pushToken: null,
        permissionStatus: resolvePermissionStatus(permissions.status),
      });
      return;
    }

    const pushToken = currentState.pushEnabled ? await getExpoPushToken() : null;
    await savePushState({
      pushEnabled: currentState.pushEnabled,
      pushToken,
      permissionStatus: "granted",
    });
  },
};

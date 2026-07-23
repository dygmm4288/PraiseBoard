import {
  NotificationSettingsState,
  PushPermissionStatus,
  PushState,
} from "./model/notification.interface";

export const resolveNotificationSettingsState = (
  pushState: PushState,
  permissionStatus: PushPermissionStatus,
): NotificationSettingsState => {
  const hasPermission = permissionStatus === "granted";
  const hasPushToken = Boolean(pushState.pushToken);

  return {
    ...pushState,
    permissionStatus,
    hasPermission,
    hasPushToken,
    isOperational: pushState.pushEnabled && hasPermission && hasPushToken,
  };
};

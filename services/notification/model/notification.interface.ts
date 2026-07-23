export type PushPlatform = "ios" | "android" | "web";
export type PushPermissionStatus = "granted" | "denied" | "undetermined";

export type PushState = {
  pushToken: string | null;
  pushEnabled: boolean;
  pushEnabledUpdatedAt: string | null;
  pushPermissionStatus: PushPermissionStatus;
  pushPermissionGrantedAt: string | null;
  pushPermissionUpdatedAt: string | null;
};

export type NotificationSettingsState = PushState & {
  permissionStatus: PushPermissionStatus;
  hasPermission: boolean;
  hasPushToken: boolean;
  isOperational: boolean;
};

export type SavePushTokenInput = {
  profileId: string;
  deviceId: string;
  pushToken: string | null;
  pushEnabled: boolean;
  pushEnabledUpdatedAt: string | null;
  platform: PushPlatform;
  pushPermissionStatus: PushPermissionStatus;
  pushPermissionGrantedAt: string | null;
  pushPermissionUpdatedAt: string | null;
};

export type PushTokenDebugInfo = {
  platform: PushPlatform;
  projectId: string | null;
  hasAndroidFcmConfig: boolean;
  permissionStatus: PushPermissionStatus;
  token: string | null;
  errorMessage: string | null;
};

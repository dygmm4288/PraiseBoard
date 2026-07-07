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

export type INotificationService = {
  bootstrap: () => Promise<void>;
  requestPermissionFromOnboarding: () => Promise<boolean>;
  getPushEnabledFromSettings: () => Promise<boolean>;
  getPushStateFromSettings: () => Promise<PushState>;
  getPushTokenDebugInfo: () => Promise<PushTokenDebugInfo>;
  setPushEnabledFromSettings: (enabled: boolean) => Promise<void>;
  syncPushToken: () => Promise<void>;
};

export type INotificationRepository = {
  getPushEnabled: (profileId: string, deviceId: string) => Promise<boolean>;
  getPushState: (profileId: string, deviceId: string) => Promise<PushState>;
  savePushToken: (input: SavePushTokenInput) => Promise<void>;
};

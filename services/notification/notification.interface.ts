export type PushPlatform = "ios" | "android" | "web";
export type PushPermissionStatus = "granted" | "denied" | "undetermined";

export type PushState = {
  pushEnabled: boolean;
  pushEnabledUpdatedAt: string | null;
  pushPermissionStatus: PushPermissionStatus;
  pushPermissionGrantedAt: string | null;
  pushPermissionUpdatedAt: string | null;
};

export type SavePushTokenInput = {
  deviceId: string;
  pushToken: string | null;
  pushEnabled: boolean;
  pushEnabledUpdatedAt: string | null;
  platform: PushPlatform;
  pushPermissionStatus: PushPermissionStatus;
  pushPermissionGrantedAt: string | null;
  pushPermissionUpdatedAt: string | null;
};

export type INotificationService = {
  bootstrap: () => Promise<void>;
  requestPermissionFromOnboarding: () => Promise<boolean>;
  getPushEnabledFromSettings: () => Promise<boolean>;
  setPushEnabledFromSettings: (enabled: boolean) => Promise<void>;
  syncPushToken: () => Promise<void>;
};

export type INotificationRepository = {
  getPushEnabled: (deviceId: string) => Promise<boolean>;
  getPushState: (deviceId: string) => Promise<PushState>;
  savePushToken: (input: SavePushTokenInput) => Promise<void>;
};

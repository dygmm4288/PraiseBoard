export type PushPlatform = "ios" | "android" | "web";

export type SavePushTokenInput = {
  deviceId: string;
  pushToken: string | null;
  pushEnabled: boolean;
  platform: PushPlatform;
};

export type INotificationService = {
  bootstrap: () => Promise<void>;
  requestPermissionFromOnboarding: () => Promise<boolean>;
  setPushEnabledFromSettings: (enabled: boolean) => Promise<void>;
  syncPushToken: () => Promise<void>;
};

export type INotificationRepository = {
  savePushToken: (input: SavePushTokenInput) => Promise<void>;
};

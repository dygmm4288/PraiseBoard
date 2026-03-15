export type INotificationService = {
  bootstrap: () => Promise<void>;
  requestPermissionFromOnboarding: () => Promise<boolean>;
  setPushEnabledFromSettings: (enabled: boolean) => Promise<void>;
  syncPushToken: () => Promise<void>;
};

export type INotificationRepository = {
    savePushToken: (input:{
        deviceId: string;
        pushToken: string | null;
        pushEnabled: boolean;
        platform: "ios" | "android";
    }) => Promise<void>;
    updatePushToken: () => Promise<void>;
};
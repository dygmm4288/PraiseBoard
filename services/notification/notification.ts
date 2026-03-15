import { INotificationService } from "./notification.interface";

export const notification: INotificationService = {
  async bootstrap() {},
  async requestPermissionFromOnboarding() {
    return true;
  },
  async setPushEnabledFromSettings(enabled) {},
  async syncPushToken() {},
};

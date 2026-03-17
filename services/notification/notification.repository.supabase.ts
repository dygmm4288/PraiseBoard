import { supabase } from "@/shared/lib/supabase";
import {
  INotificationRepository,
  SavePushTokenInput,
} from "./notification.interface";

export const notificationRepository: INotificationRepository = {
  async savePushToken({
    deviceId,
    pushToken,
    pushEnabled,
    platform,
  }: SavePushTokenInput) {
    const { error } = await supabase
      .from("devices")
      .update({
        push_token: pushToken,
        push_enabled: pushEnabled,
        platform,
      })
      .eq("device_id", deviceId);

    if (error) throw error;
  },
};

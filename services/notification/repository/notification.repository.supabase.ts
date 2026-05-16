import { supabase } from "@/shared/lib/supabase";
import {
  INotificationRepository,
  PushPermissionStatus,
  PushState,
  SavePushTokenInput,
} from "../model/notification.interface";

export const notificationRepository: INotificationRepository = {
  async getPushEnabled(deviceId: string) {
    const state = await this.getPushState(deviceId);
    return state.pushEnabled;
  },
  async getPushState(deviceId: string): Promise<PushState> {
    const { data, error } = await supabase
      .from("devices")
      .select(
        "push_enabled, push_enabled_updated_at, push_permission_status, push_permission_granted_at, push_permission_updated_at",
      )
      .eq("device_id", deviceId)
      .maybeSingle();

    if (error) throw error;

    return {
      pushEnabled: data?.push_enabled ?? false,
      pushEnabledUpdatedAt: data?.push_enabled_updated_at ?? null,
      pushPermissionStatus:
        (data?.push_permission_status as PushPermissionStatus | undefined) ??
        "undetermined",
      pushPermissionGrantedAt: data?.push_permission_granted_at ?? null,
      pushPermissionUpdatedAt: data?.push_permission_updated_at ?? null,
    };
  },
  async savePushToken({
    deviceId,
    pushToken,
    pushEnabled,
    pushEnabledUpdatedAt,
    platform,
    pushPermissionStatus,
    pushPermissionGrantedAt,
    pushPermissionUpdatedAt,
  }: SavePushTokenInput) {
    const { error } = await supabase
      .from("devices")
      .update({
        push_token: pushToken,
        push_enabled: pushEnabled,
        push_enabled_updated_at: pushEnabledUpdatedAt,
        push_permission_status: pushPermissionStatus,
        push_permission_granted_at: pushPermissionGrantedAt,
        push_permission_updated_at: pushPermissionUpdatedAt,
        platform,
      })
      .eq("device_id", deviceId);

    if (error) throw error;
  },
};

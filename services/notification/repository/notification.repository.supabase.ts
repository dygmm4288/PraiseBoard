import { supabase } from "@/shared/lib/supabase";
import {
  INotificationRepository,
  PushPermissionStatus,
  PushState,
  SavePushTokenInput,
} from "../model/notification.interface";

const releaseDuplicatePushToken = async ({
  profileId,
  deviceId,
  pushToken,
}: {
  profileId: string;
  deviceId: string;
  pushToken: string;
}) => {
  const { error: claimError } = await supabase.rpc("claim_device_push_token", {
    p_profile_id: profileId,
    p_device_id: deviceId,
    p_push_token: pushToken,
  });

  if (!claimError) return;

  if (claimError.code !== "PGRST202") {
    throw claimError;
  }

  const { error: releaseError } = await supabase
    .from("devices")
    .update({ push_token: null })
    .eq("push_token", pushToken)
    .or(`profile_id.neq.${profileId},device_id.neq.${deviceId}`);

  if (releaseError) throw releaseError;
};

export const notificationRepository: INotificationRepository = {
  async getPushEnabled(profileId: string, deviceId: string) {
    const state = await this.getPushState(profileId, deviceId);
    return state.pushEnabled;
  },
  async getPushState(profileId: string, deviceId: string): Promise<PushState> {
    const { data, error } = await supabase
      .from("devices")
      .select(
        "push_token, push_enabled, push_enabled_updated_at, push_permission_status, push_permission_granted_at, push_permission_updated_at",
      )
      .eq("profile_id", profileId)
      .eq("device_id", deviceId)
      .maybeSingle();

    if (error) throw error;

    return {
      pushToken: data?.push_token ?? null,
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
    profileId,
    deviceId,
    pushToken,
    pushEnabled,
    pushEnabledUpdatedAt,
    platform,
    pushPermissionStatus,
    pushPermissionGrantedAt,
    pushPermissionUpdatedAt,
  }: SavePushTokenInput) {
    if (pushToken) {
      await releaseDuplicatePushToken({ profileId, deviceId, pushToken });
    }

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
      .eq("profile_id", profileId)
      .eq("device_id", deviceId);

    if (error) throw error;
  },
};

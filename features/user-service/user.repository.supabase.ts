import { supabase } from "@/shared/lib/supabase";
import { IUserRepository } from "./user.interface";

export const userRepository: IUserRepository = {
  updateLastLogin: async (deviceId) => {
    await supabase
      .from("devices")
      .update({ last_login_at: new Date().toISOString() })
      .eq("device_id", deviceId);
  },
  createProfile: async () => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({})
      .select("id")
      .single();
    if (error) throw error;

    return data.id;
  },
  linkDeviceToProfile: async (deviceId, profileId) => {
    const { error } = await supabase
      .from("devices")
      .insert({ device_id: deviceId, profile_id: profileId });

    if (error) throw error;
  },
};

import { supabase } from "@/shared/lib/supabase";
import { IUserRepository } from "./user.interface";

export const userRepository: IUserRepository = {
  ensureAnonymousSession: async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;
    if (session?.user?.id) return session.user.id;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) throw error;

    const authUserId = data.user?.id ?? data.session?.user?.id;
    if (!authUserId) {
      throw new Error("Anonymous sign-in did not return a user id");
    }

    return authUserId;
  },
  updateLastLogin: async (deviceId) => {
    const { error } = await supabase
      .from("devices")
      .update({ last_login_at: new Date().toISOString() })
      .eq("device_id", deviceId);

    if (error) throw error;
  },
  createProfile: async (authUserId) => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({ auth_user_id: authUserId })
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

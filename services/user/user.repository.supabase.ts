import { supabase } from "@/shared/lib/supabase";
import { IUserRepository } from "./user.interface";

const PROFILE_SELECT =
  "id, auth_user_id, nickname, mbti, created_at, updated_at, last_login_at";

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
  createProfile: async (authUserId) => {
    const { data, error } = await supabase
      .from("profiles")
      .insert({ auth_user_id: authUserId })
      .select(PROFILE_SELECT)
      .single();
    if (error) throw error;

    return data;
  },
  updateProfile: async (profileId, input) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        nickname: input.nickname,
      })
      .eq("id", profileId)
      .select(PROFILE_SELECT)
      .single();

    if (error) throw error;
    return data;
  },

  async getProfile(profileId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("id", profileId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async getMyProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
  async ensureDeviceLink(deviceId: string, profileId: string) {
    const { error } = await supabase.from("devices").upsert(
      {
        device_id: deviceId,
        profile_id: profileId,
      },
      {
        onConflict: "device_id",
      },
    );
    if (error) throw error;
  },
  async syncLoginMetadata(profileId, deviceId) {
    const timestamp = new Date().toISOString();

    const [{ error: deviceError }, { error: profileError }] = await Promise.all(
      [
        supabase
          .from("devices")
          .update({ last_login_at: timestamp })
          .eq("device_id", deviceId),
        supabase
          .from("profiles")
          .update({ last_login_at: timestamp })
          .eq("id", profileId),
      ],
    );

    if (deviceError) throw deviceError;
    if (profileError) throw profileError;
  },
};

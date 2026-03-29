import { Database } from "@/shared/types/supabase.types";

export type AuthState = 'public' | 'anonymous' | 'member';

export type CurrentAuthUser = {
  authUserId: string | null;
  authState: AuthState;
};

export type UpdateProfileInput = {
  nickname: string | null;
};

export type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

export interface IUserRepository {
  ensureAnonymousSession(): Promise<string>;

  getProfile(profileId: string): Promise<UserProfile | null>;
  getMyProfile(): Promise<UserProfile | null>;
  getCurrentAuthUser(): Promise<CurrentAuthUser>;

  createProfile(authUserId: string): Promise<UserProfile>;

  ensureDeviceLink(deviceId: string, profileId: string): Promise<void>;
  syncLoginMetadata(profileId: string, deviceId: string): Promise<void>;

  updateProfile(
    profileId: string,
    input: UpdateProfileInput,
  ): Promise<UserProfile>;
}

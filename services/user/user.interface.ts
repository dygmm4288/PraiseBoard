export type UpdateProfileInput = {
  nickname: string | null;
};

export interface IUserRepository {
  ensureAnonymousSession(): Promise<string>;
  updateLastLogin(deviceId: string): Promise<void>;
  createProfile(authUserId: string): Promise<string>;
  linkDeviceToProfile(deviceId: string, profileId: string): Promise<void>;
  updateProfile(profileId: string, input: UpdateProfileInput): Promise<void>;
}

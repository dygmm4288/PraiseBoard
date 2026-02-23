export interface IUserRepository {
  updateLastLogin(deviceId: string): Promise<void>;
  createProfile(): Promise<string>;
  linkDeviceToProfile(deviceId: string, profileId: string): Promise<void>;
}

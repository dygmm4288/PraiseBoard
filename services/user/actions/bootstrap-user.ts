import { localStorage } from "@/infra/storage";
import { IStorage } from "@/infra/storage/storage.interface";
import * as Crypto from "expo-crypto";
import { reportError } from "@/shared/lib/report-error";
import { AuthState } from "../model/user.interface";
import { userApi } from "../user.api";

export type BootstrapUserResult = {
  authUserId: string;
  profileId: string;
  deviceId: string;
  authState: AuthState;
};

type BootstrapUserDependencies = {
  ensureAnonymousSession: typeof userApi.ensureAnonymousSession;
  getCurrentAuthUser: typeof userApi.getCurrentAuthUser;
  getMyProfile: typeof userApi.getMyProfile;
  createProfile: typeof userApi.createProfile;
  ensureDeviceLink: typeof userApi.ensureDeviceLink;
  syncLoginMetadata: typeof userApi.syncLoginMetadata;
  storage: Pick<IStorage, "getItem" | "setItem">;
  createDeviceId: () => string;
  reportSecondaryError: (error: unknown) => void;
};

const defaultDependencies: BootstrapUserDependencies = {
  ensureAnonymousSession: userApi.ensureAnonymousSession,
  getCurrentAuthUser: userApi.getCurrentAuthUser,
  getMyProfile: userApi.getMyProfile,
  createProfile: userApi.createProfile,
  ensureDeviceLink: userApi.ensureDeviceLink,
  syncLoginMetadata: userApi.syncLoginMetadata,
  storage: localStorage,
  createDeviceId: Crypto.randomUUID,
  reportSecondaryError: (error) => {
    reportError(error, {
      scope: "user.bootstrap.syncLoginMetadata",
      severity: "warning",
    });
  },
};

export const bootstrapUser = async (
  dependencies: BootstrapUserDependencies = defaultDependencies,
): Promise<BootstrapUserResult> => {
  const authUserId = await dependencies.ensureAnonymousSession();
  const { authState } = await dependencies.getCurrentAuthUser();

  const existingProfile = await dependencies.getMyProfile();
  const profile =
    existingProfile ?? (await dependencies.createProfile(authUserId));

  const storedDeviceId = await dependencies.storage.getItem("device_id");
  const deviceId = storedDeviceId ?? dependencies.createDeviceId();

  await dependencies.ensureDeviceLink(deviceId, profile.id);
  await Promise.all([
    dependencies.storage.setItem("device_id", deviceId),
    dependencies.storage.setItem("profile_id", profile.id),
  ]);

  try {
    await dependencies.syncLoginMetadata(profile.id, deviceId);
  } catch (error) {
    dependencies.reportSecondaryError(error);
  }

  return {
    authUserId,
    profileId: profile.id,
    deviceId,
    authState,
  };
};

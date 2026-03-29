import { localStorage } from "@/infra/storage";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";
import { AuthState } from "./user.interface";
import { userRepository } from "./user.repository.impl";

type UserBootstrapState = {
  isInitialized: boolean;
  authUserId: string | null;
  profileId: string | null;
  deviceId: string | null;
  authState: AuthState;
};

export const useUserBootstrap = (): UserBootstrapState => {
  const [state, setState] = useState<UserBootstrapState>({
    isInitialized: false,
    authUserId: null,
    profileId: null,
    deviceId: null,
    authState: "public",
  });

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        const authUserId = await userRepository.ensureAnonymousSession();
        const { authState } = await userRepository.getCurrentAuthUser();

        let profile = await userRepository.getMyProfile();
        if (!profile) {
          profile = await userRepository.createProfile(authUserId);
        }

        const storedDeviceId = await localStorage.getItem("device_id");
        const deviceId = storedDeviceId ?? Crypto.randomUUID();

        await userRepository.ensureDeviceLink(deviceId, profile.id);
        await userRepository.syncLoginMetadata(profile.id, deviceId);

        await Promise.all([
          localStorage.setItem("device_id", deviceId),
          localStorage.setItem("profile_id", profile.id),
        ]);

        if (!isMounted) return;

        setState({
          isInitialized: true,
          authUserId,
          profileId: profile.id,
          deviceId,
          authState: authState,
        });
      } catch (error) {
        console.error("유저 bootstrap 중 오류 발생", error);

        if (!isMounted) return;

        setState({
          isInitialized: true,
          authUserId: null,
          profileId: null,
          deviceId: null,
          authState: "public",
        });
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
};

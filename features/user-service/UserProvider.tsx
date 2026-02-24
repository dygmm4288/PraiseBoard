import { localStorage } from "@/infra/storage";
import * as Crypto from "expo-crypto";
import React, { createContext, useContext, useEffect, useState } from "react";
import { userRepository } from "./index";

interface UserContextType {
  isInitialized: boolean;
  profileId: string | null;
  hasSeenIntro: boolean;
  completeIntro: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean>(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [storedDeviceId, storedProfileId, storedHasSeenIntro] =
          await Promise.all([
            localStorage.getItem("device_id"),
            localStorage.getItem("profile_id"),
            localStorage.getItem("has_seen_intro"),
          ]);

        if (storedHasSeenIntro) {
          setHasSeenIntro(true);
        }

        if (storedDeviceId && storedProfileId) {
          setProfileId(storedProfileId);
          await userRepository.updateLastLogin(storedDeviceId);
        } else {
          const authUserId = await userRepository.ensureAnonymousSession();

          const newDeviceId = Crypto.randomUUID();
          const newProfileId = await userRepository.createProfile(authUserId);
          await userRepository.linkDeviceToProfile(newDeviceId, newProfileId);

          await localStorage.setItem("device_id", newDeviceId);
          await localStorage.setItem("profile_id", newProfileId);

          setProfileId(newProfileId);
        }
      } catch (error) {
        console.error("앱 초기화 중 오류 발생", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  const completeIntro = async () => {
    try {
      await localStorage.setItem("has_seen_intro", "true");
      setHasSeenIntro(true);
    } catch (error) {
      console.error("인트로 초기화 오류 발생", error);
    }
  };

  const value = {
    isInitialized,
    profileId,
    hasSeenIntro,
    completeIntro,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must use in UserProvider");
  }
  return context;
};

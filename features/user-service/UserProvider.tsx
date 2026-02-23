import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import React, { createContext, useContext, useEffect, useState } from "react";
import { userRepository } from "./index";

interface UserContextType {
  isInitialized: boolean;
  profileId: string | null;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem("device_id");
        const storedProfileId = await AsyncStorage.getItem("profile_id");

        if (storedDeviceId && storedProfileId) {
          setProfileId(storedProfileId);
          await userRepository.updateLastLogin(storedDeviceId);
        } else {
          const newDeviceId = Crypto.randomUUID();
          const newProfileId = await userRepository.createProfile();
          await userRepository.linkDeviceToProfile(newDeviceId, newProfileId);

          await AsyncStorage.setItem("device_id", newDeviceId);
          await AsyncStorage.setItem("profile_id", newProfileId);

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

  const value = {
    isInitialized,
    profileId,
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

import { userRepository } from "@/features/user-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { useEffect, useState } from "react";

const useApiInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem("device_id");
        const storedProfileId = await AsyncStorage.getItem("profile_id");
        const authUserId = await userRepository.ensureAnonymousSession();

        if (storedDeviceId && storedProfileId) {
          // [기존 유저]
          setProfileId(storedProfileId);
          await userRepository.updateLastLogin(storedDeviceId);
        } else {
          // [신규 유저]

          const newDeviceId = Crypto.randomUUID();
          const newProfileId = await userRepository.createProfile(authUserId);

          await userRepository.linkDeviceToProfile(newDeviceId, newProfileId);

          await AsyncStorage.setItem("device_id", newDeviceId);
          await AsyncStorage.setItem("profile_id", newProfileId);

          setProfileId(newProfileId);
          console.log("신규 유저 프로필 생성 및 저장 완료:", newProfileId);
        }
      } catch (error) {
        console.error("앱 초기화 중 오류 발생", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []);

  return {
    isInitialized,
    profileId,
  };
};

export default useApiInit;

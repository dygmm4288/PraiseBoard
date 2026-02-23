import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const useApiInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedDeviceId = await AsyncStorage.getItem("device_id");
        const storedProfileId = await AsyncStorage.getItem("profile_id");

        if (storedDeviceId && storedProfileId) {
          // [기존 유저]
          setProfileId(storedProfileId);
          await supabase
            .from("devices")
            .update({ last_login_at: new Date().toISOString() })
            .eq("device_id", storedDeviceId);
        } else {
          // [신규 유저]

          const newDeviceId = new Crypto().randomUUID();

          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .insert({})
            .select("id")
            .single();

          if (profileError) throw profileError;

          const newProfileId = profileData.id;

          const { error: deviceError } = await supabase.from("devices").insert({
            device_id: newDeviceId,
            profile_id: newProfileId,
          });

          if (deviceError) throw deviceError;

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

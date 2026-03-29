// 책임. profiles rows 조회와 갱신 후 동기화.

import { useEffect, useState } from "react";
import { UpdateProfileInput, UserProfile } from "./user.interface";
import { userRepository } from "./user.repository.impl";

type UseCurrentProfileResult = {
  profile: UserProfile | null;
  nickname: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
};

export const useCurrentProfile = (
  profileId: string | null,
): UseCurrentProfileResult => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(profileId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!profileId) {
      setProfile(null);
      setErrorMessage("프로필 정보를 확인할 수 없어요.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const nextProfile = await userRepository.getProfile(profileId);
      setProfile(nextProfile);

      if (!nextProfile) {
        setErrorMessage("프로필을 찾을 수 없어요.");
      }
    } catch (error) {
      console.error("프로필 조회 중 오류 발생", error);
      setProfile(null);
      setErrorMessage("프로필 불러오는 중 오류가 발생했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (input: UpdateProfileInput) => {
    if (!profileId) throw new Error("profileId is required to update profile");

    try {
      setErrorMessage(null);
      const updatedProfile = await userRepository.updateProfile(
        profileId,
        input,
      );
      setProfile(updatedProfile);
    } catch (error) {
      console.error("프로필 수정 중 오류 발생", error);

      setErrorMessage("프로필 저장하는 중 오류가 발생했어요.");

      throw error;
    }
  };

  useEffect(() => {
    void refreshProfile();
  }, [profileId]);

  return {
    profile,
    nickname: profile?.nickname ?? null,
    isLoading,
    errorMessage,
    refreshProfile,
    updateProfile,
  };
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UpdateProfileInput, UserProfile } from "../model/user.interface";
import { userKeys } from "../queries/user.query.key";
import { userApi } from "../user.api";

type UseCurrentProfileResult = {
  profile: UserProfile | null;
  nickname: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<UserProfile>;
};

export const useCurrentProfile = (
  profileId: string | null,
): UseCurrentProfileResult => {
  const queryClient = useQueryClient();
  const profileQuery = useQuery({
    queryKey: profileId
      ? userKeys.profile(profileId)
      : [...userKeys.profiles(), "idle"],
    queryFn: () => {
      if (!profileId) throw new Error("profileId is required");
      return userApi.getProfile(profileId);
    },
    enabled: Boolean(profileId),
  });
  const updateMutation = useMutation({
    mutationFn: (input: UpdateProfileInput) => {
      if (!profileId) {
        throw new Error("profileId is required to update profile");
      }
      return userApi.updateProfile(profileId, input);
    },
    onSuccess: (updatedProfile) => {
      if (!profileId) return;
      queryClient.setQueryData(userKeys.profile(profileId), updatedProfile);
    },
  });

  const profile = profileQuery.data ?? null;
  const errorMessage = !profileId
    ? "프로필 정보를 확인할 수 없어요."
    : profileQuery.error
      ? "프로필 불러오는 중 오류가 발생했어요."
      : updateMutation.error
        ? "프로필 저장하는 중 오류가 발생했어요."
        : profileQuery.isSuccess && !profile
          ? "프로필을 찾을 수 없어요."
          : null;

  const refreshProfile = async () => {
    await profileQuery.refetch();
  };

  return {
    profile,
    nickname: profile?.nickname ?? null,
    isLoading: profileQuery.isLoading,
    errorMessage,
    refreshProfile,
    updateProfile: updateMutation.mutateAsync,
  };
};

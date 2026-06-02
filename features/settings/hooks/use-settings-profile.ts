import { useCurrentProfile, useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useCallback, useEffect, useState } from "react";

export const useSettingsProfile = () => {
  const { profileId, authState } = useUser();
  const { nickname, updateProfile } = useCurrentProfile(profileId);
  const displayName =
    nickname || (authState === "anonymous" ? "김고래" : "이름 없음");
  const [draftName, setDraftName] = useState(displayName);
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    setDraftName(displayName);
  }, [displayName]);

  const resetDraftName = useCallback(() => {
    setDraftName(displayName);
  }, [displayName]);

  const saveDraftName = useCallback(async () => {
    const nextName = draftName.trim();

    if (!nextName) {
      toast.error("이름을 입력해 주세요.");
      return false;
    }

    setIsSavingName(true);

    try {
      await updateProfile({ nickname: nextName });
      return true;
    } catch {
      toast.error("이름을 저장하는 중 오류가 발생했어요.");
      return false;
    } finally {
      setIsSavingName(false);
    }
  }, [draftName, updateProfile]);

  return {
    displayName,
    draftName,
    isSavingName,
    resetDraftName,
    saveDraftName,
    setDraftName,
  };
};

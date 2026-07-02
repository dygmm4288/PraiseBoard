import { nicknameSchema } from "@/features/board/schema";
import { useCurrentProfile, useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useCallback } from "react";

const getDeviceTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul";
  } catch {
    return "Asia/Seoul";
  }
};

export const useSettingsProfile = () => {
  const { profileId, authState } = useUser();
  const { nickname, profile, updateProfile } = useCurrentProfile(profileId);
  const displayName =
    nickname || (authState === "anonymous" ? "김고래" : "이름 없음");

  const saveName = useCallback(async (name: string) => {
    const parsedName = nicknameSchema.safeParse(name);

    if (!parsedName.success) {
      toast.error(parsedName.error.issues[0]?.message);
      return false;
    }

    try {
      await updateProfile({ nickname: parsedName.data });
      return true;
    } catch {
      toast.error("이름을 저장하는 중 오류가 발생했어요.");
      return false;
    }
  }, [updateProfile]);

  const saveReminderTime = useCallback(
    async ({
      reminderHour,
      reminderMinute,
    }: {
      reminderHour: number;
      reminderMinute: number;
    }) => {
      try {
        await updateProfile({
          reminderHour,
          reminderMinute,
          reminderTimes: [{ hour: reminderHour, minute: reminderMinute }],
          timezone: getDeviceTimezone(),
        });
        return true;
      } catch {
        toast.error("알림 시간을 저장하는 중 오류가 발생했어요.");
        return false;
      }
    },
    [updateProfile],
  );

  return {
    displayName,
    profile,
    saveName,
    saveReminderTime,
  };
};

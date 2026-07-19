import { nicknameSchema } from "@/features/board/schema";
import { useCurrentProfile, useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import * as Notifications from "expo-notifications";
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

  const saveName = useCallback(
    async (name: string) => {
      const parsedName = nicknameSchema.safeParse(name);

      if (!parsedName.success) {
        toast.error(parsedName.error.issues[0]?.message);
        return false;
      }

      if (parsedName.data === nickname) return true;

      try {
        await updateProfile({ nickname: parsedName.data });
        return true;
      } catch {
        toast.error("이름을 저장하는 중 오류가 발생했어요.");
        return false;
      }
    },
    [updateProfile],
  );

  const saveReminderTime = useCallback(
    async ({
      reminderHour,
      reminderMinute,
    }: {
      reminderHour: number;
      reminderMinute: number;
    }) => {
      try {
        const permissions = await Notifications.getPermissionsAsync();

        if (permissions.status !== "granted") {
          toast.error("기기 설정에서 알림 권한을 허용해 주세요.");
          return false;
        }

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

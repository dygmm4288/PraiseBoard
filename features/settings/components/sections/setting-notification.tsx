import { notification } from "@/services/notification";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { AppState, Pressable } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingInfoBox from "../setting-info-box";
import SettingToggle from "../setting-toggle";

const NoSettingNotification = () => {
  return (
    <SettingInfoBox>
      {`기기 설정에서 알림 권한을 허용해 주세요
구슬 모으기를 잊지 않도록 알림을 보내드려요`}
    </SettingInfoBox>
  );
};

type SettingNotificationProps = {
  alarmTimeLabel: string;
  onEditAlarmTime: () => void;
};

const SettingNotification = ({
  alarmTimeLabel,
  onEditAlarmTime,
}: SettingNotificationProps) => {
  const [isNotifications, setIsNotifications] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncNotificationState = async () => {
      try {
        const [enabled, permissions] = await Promise.all([
          notification.getPushEnabledFromSettings(),
          Notifications.getPermissionsAsync(),
        ]);

        if (!isMounted) return;

        setIsNotifications(enabled);
        setHasPermission(permissions.status === "granted");
      } catch (error) {
        console.error("알림 설정 상태 조회 중 오류 발생", error);

        if (!isMounted) return;

        setIsNotifications(false);
        setHasPermission(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void syncNotificationState();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void syncNotificationState();
      }
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  const handleToggle = async (nextValue: boolean) => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      await notification.setPushEnabledFromSettings(nextValue);

      const [enabled, permissions] = await Promise.all([
        notification.getPushEnabledFromSettings(),
        Notifications.getPermissionsAsync(),
      ]);

      setIsNotifications(enabled);
      setHasPermission(permissions.status === "granted");

      if (nextValue && permissions.status !== "granted") {
        toast.error("기기 설정에서 알림 권한을 허용해 주세요.");
      }
    } catch (error) {
      console.error("알림 설정 변경 중 오류 발생", error);
      toast.error("알림 설정을 변경하는 중 오류가 발생했어요.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SettingSectionLayout title="알림">
      {!isLoading && hasPermission && (
        <SettingToggle
          label="정기 알림"
          description="설정한 시간에 알림을 보내드려요"
          value={isNotifications}
          onToggle={handleToggle}
          disabled={isLoading || isUpdating}
          accessory={
            isNotifications ? (
              <Pressable
                className="mt-[9px] h-[26px] self-start rounded-[100px] bg-[#F1ECFC] px-[9px] py-[3px]"
                onPress={onEditAlarmTime}
              >
                <AppText
                  variant="custom"
                  weight="medium"
                  className="text-[12px] leading-[20px] text-[#7F5ADD]"
                >
                  {alarmTimeLabel}
                </AppText>
              </Pressable>
            ) : null
          }
        />
      )}
      {!isLoading && !hasPermission && <NoSettingNotification />}
    </SettingSectionLayout>
  );
};

export default SettingNotification;

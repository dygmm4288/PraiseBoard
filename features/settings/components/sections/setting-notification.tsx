import { notification } from "@/services/notification";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { AppState, View } from "react-native";
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

const SettingNotification = () => {
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
      <View className="flex-row items-center justify-between">
        {!isLoading && hasPermission && (
          <View className="w-full flex flex-col gap-[6px] items-stretch">
            <SettingToggle
              label="정기알림"
              value={isNotifications}
              onToggle={handleToggle}
              disabled={isLoading || isUpdating}
            />
            <AppText variant="caption2" className="text-gray-400">
              설정한 시간에 알림을 보내드려요
            </AppText>
          </View>
        )}
      </View>
      {!isLoading && !hasPermission && <NoSettingNotification />}
    </SettingSectionLayout>
  );
};

export default SettingNotification;

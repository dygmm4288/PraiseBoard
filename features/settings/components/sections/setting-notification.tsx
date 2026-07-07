import { notification } from "@/services/notification";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { AppState, Linking, Pressable, View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingToggle from "../setting-toggle";

const TOP_TOAST_OPTIONS = {
  position: "top" as const,
};

const NoSettingNotification = () => {
  const openNotificationSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error("기기 알림 설정 화면을 여는 중 오류 발생", error);
      toast.error("기기 설정 화면을 열지 못했어요.", TOP_TOAST_OPTIONS);
    }
  };

  return (
    <View className="w-full gap-[10px] px-[20px]">
      <AppText
        variant="body3"
        className="text-[14px] leading-[20px] text-black"
      >
        {`기기 설정에서 알림 권한을 허용해 주세요
구슬 모으기를 잊지 않도록 알림을 보내드려요`}
      </AppText>
      <Pressable
        className="h-[34px] self-start justify-center rounded-[100px] bg-primary-10 px-[12px]"
        onPress={openNotificationSettings}
      >
        <AppText
          variant="custom"
          weight="medium"
          className="text-[13px] leading-[20px] text-primary-50"
        >
          기기 설정 열기
        </AppText>
      </Pressable>
    </View>
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
        const [pushState, permissions] = await Promise.all([
          notification.getPushStateFromSettings(),
          Notifications.getPermissionsAsync(),
        ]);

        if (!isMounted) return;

        setIsNotifications(pushState.pushEnabled);
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

    const previousValue = isNotifications;

    setIsNotifications(nextValue);
    setIsUpdating(true);

    try {
      await notification.setPushEnabledFromSettings(nextValue);

      const [pushState, permissions] = await Promise.all([
        notification.getPushStateFromSettings(),
        Notifications.getPermissionsAsync(),
      ]);

      setIsNotifications(pushState.pushEnabled);
      setHasPermission(permissions.status === "granted");

      if (!nextValue) {
        return;
      }

      if (permissions.status !== "granted") {
        toast.error(
          "기기 설정에서 알림 권한을 허용해 주세요.",
          TOP_TOAST_OPTIONS,
        );
        return;
      }

      if (!pushState.pushEnabled) {
        toast.error(
          "알림을 켜지 못했어요. 잠시 후 다시 시도해 주세요.",
          TOP_TOAST_OPTIONS,
        );
        return;
      }

      if (!pushState.pushToken) {
        toast.error(
          "알림 권한은 켰지만 푸시 토큰을 발급받지 못했어요. 앱을 다시 실행한 뒤 확인해 주세요.",
          TOP_TOAST_OPTIONS,
        );
      }
    } catch (error) {
      console.error("알림 설정 변경 중 오류 발생", error);
      setIsNotifications(previousValue);
      toast.error(
        "알림 설정을 변경하는 중 오류가 발생했어요.",
        TOP_TOAST_OPTIONS,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SettingSectionLayout title="알림">
      {!isLoading && (
        <SettingToggle
          label="정기 알림"
          description="설정한 시간에 알림을 보내드려요"
          value={isNotifications}
          onToggle={handleToggle}
          disabled={isLoading || isUpdating}
          accessory={
            isNotifications ? (
              <Pressable
                className="mt-[9px] h-[26px] self-start rounded-[100px] bg-primary-10 px-[9px] py-[3px]"
                onPress={onEditAlarmTime}
              >
                <AppText
                  variant="custom"
                  weight="medium"
                  className="text-[12px] leading-[20px] text-primary-50"
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

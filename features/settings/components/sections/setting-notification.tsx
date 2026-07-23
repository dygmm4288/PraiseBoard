import { notification } from "@/services/notification";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import { useEffect, useState } from "react";
import { AppState, Linking, Platform, Pressable, View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingLink from "../setting-link";
import SettingToggle from "../setting-toggle";
import { Icon } from "@/assets/icons";

const DeviceNotificationSettingsLink = () => {
  const openNotificationSettings = async () => {
    try {
      if (Platform.OS === "android") {
        const packageName = Constants.expoConfig?.android?.package;

        if (packageName) {
          await IntentLauncher.startActivityAsync(
            IntentLauncher.ActivityAction.APP_NOTIFICATION_SETTINGS,
            {
              extra: {
                "android.provider.extra.APP_PACKAGE": packageName,
              },
            },
          );
          return;
        }
      }

      if (Platform.OS === "ios") {
        await Linking.openURL("app-settings:notifications");
        return;
      }

      await Linking.openSettings();
    } catch (error) {
      console.error("기기 알림 설정 화면을 여는 중 오류 발생", error);
      toast.error("기기 설정 화면을 열지 못했어요.");
    }
  };

  return (
    <SettingLink showChevron onLink={openNotificationSettings}>
      <View className="gap-[3px]">
        <AppText variant="body14" className="text-black">
          정기 알림
        </AppText>
        <AppText variant="label12" className="text-content-tertiary">
          기기 설정에서 알림 권한을 허용해 주세요
        </AppText>
      </View>
    </SettingLink>
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
        const settingsState = await notification.getSettingsState();

        if (!isMounted) return;

        setIsNotifications(settingsState.pushEnabled);
        setHasPermission(settingsState.hasPermission);
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

      const settingsState = await notification.getSettingsState();

      setIsNotifications(settingsState.pushEnabled);
      setHasPermission(settingsState.hasPermission);

      if (!nextValue) {
        return;
      }

      if (!settingsState.hasPermission) {
        toast.error("기기 설정에서 알림 권한을 허용해 주세요.");
        return;
      }

      if (!settingsState.pushEnabled) {
        toast.error("알림을 켜지 못했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      if (!settingsState.hasPushToken) {
        toast.error(
          "알림 권한은 켰지만 푸시 토큰을 발급받지 못했어요. 앱을 다시 실행한 뒤 확인해 주세요.",
        );
        return;
      }
    } catch (error) {
      console.error("알림 설정 변경 중 오류 발생", error);
      setIsNotifications(previousValue);
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
                className="mt-[9px] h-[26px] self-start flex-row items-center gap-[3px] rounded-[100px] bg-primary-10 px-[9px] py-[3px]"
                onPress={onEditAlarmTime}
              >
                <Icon name="Notification" width={10} height={14} />
                <AppText
                  variant="label12"
                  weight="medium"
                  className="text-primary-50"
                >
                  {alarmTimeLabel}
                </AppText>
              </Pressable>
            ) : null
          }
        />
      )}
      {!isLoading && !hasPermission && <DeviceNotificationSettingsLink />}
    </SettingSectionLayout>
  );
};

export default SettingNotification;

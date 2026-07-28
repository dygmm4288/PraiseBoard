import { useNotificationSettings } from "@/services/notification";
import { useUser } from "@/services/user";
import { reportError } from "@/shared/lib/report-error";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";
import { Linking, Platform, View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingLink from "../setting-link";
import SettingToggle from "../setting-toggle";

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
      reportError(error, { scope: "notification.openDeviceSettings" });
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

type SettingNotificationFixedProps = {
  alarmTimeLabel: string;
  onEditAlarmTime: () => void;
};

const SettingNotificationFixed = (_props: SettingNotificationFixedProps) => {
  const { profileId } = useUser();
  const {
    settingsState,
    isLoading,
    isUpdating,
    setPushEnabled,
  } = useNotificationSettings(profileId);
  const isNotifications = settingsState?.pushEnabled ?? false;
  const hasPermission = settingsState?.hasPermission ?? false;

  const handleToggle = async (nextValue: boolean) => {
    if (isUpdating) return;

    try {
      const nextSettingsState = await setPushEnabled(nextValue);

      if (!nextValue) {
        return;
      }

      if (!nextSettingsState.hasPermission) {
        toast.error("기기 설정에서 알림 권한을 허용해 주세요.");
        return;
      }

      if (!nextSettingsState.pushEnabled) {
        toast.error("알림을 켜지 못했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }

      if (!nextSettingsState.hasPushToken) {
        toast.error(
          "알림 권한은 켰지만 푸시 토큰을 발급받지 못했어요. 앱을 다시 실행한 뒤 확인해 주세요.",
        );
      }
    } catch (error) {
      reportError(error, { scope: "notification.updateSettings" });
      toast.error("알림 설정을 변경하는 중 오류가 발생했어요.");
    }
  };

  return (
    <SettingSectionLayout title="알림">
      {!isLoading && hasPermission && (
        <SettingToggle
          label="정기 알림"
          description="오후 9시에 알림을 보내드려요"
          value={isNotifications}
          onToggle={handleToggle}
          disabled={isLoading || isUpdating}
        />
      )}
      {!isLoading && !hasPermission && <DeviceNotificationSettingsLink />}
    </SettingSectionLayout>
  );
};

export default SettingNotificationFixed;

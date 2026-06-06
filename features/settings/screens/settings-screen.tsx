import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { Link } from "expo-router";
import { ScrollView } from "react-native";
import SettingEnv from "../components/sections/setting-env";
import SettingInfo from "../components/sections/setting-info";
import SettingNotification from "../components/sections/setting-notification";
import SettingProfile from "../components/sections/setting-profile";
import { useSettingsSheets } from "../hooks/use-settings-sheets";

const SettingsScreen = () => {
  const { alarmTimeLabel, displayName, openAlarmTimeSheet, openNameSheet } =
    useSettingsSheets();

  return (
    <Screen className="pb-[118px]">
      <ScreenHeader title="설정" className="px-[8px]" />
      <ScrollView
        className="mt-[12px] flex-1"
        contentContainerClassName="gap-[30px] pb-[24px]"
        showsVerticalScrollIndicator={false}
      >
        {/* 내 정보 */}
        <SettingProfile name={displayName} onEditName={openNameSheet} />

        {/* 알림 */}
        <SettingNotification
          alarmTimeLabel={alarmTimeLabel}
          onEditAlarmTime={openAlarmTimeSheet}
        />
        {/* 환경 */}
        <SettingEnv />

        {/* 앱 정보 */}
        <SettingInfo />

        {/* Debug 설정 이동 */}
        <Link href="/debug-settings">debug settings 이동</Link>
      </ScrollView>
    </Screen>
  );
};

export default SettingsScreen;

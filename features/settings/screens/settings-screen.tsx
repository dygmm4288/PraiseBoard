import { Screen } from "@/shared/ui";
import { FnbScrollView } from "@/features/navigation";
import { isDebugEnabled } from "@/shared/constants/environment";
import ScreenHeader from "@/shared/ui/screen-header";
import { Link } from "expo-router";
import SettingEnv from "../components/sections/setting-env";
import SettingInfo from "../components/sections/setting-info";
import SettingNotification from "../components/sections/setting-notification";
import SettingProfile from "../components/sections/setting-profile";
import { useSettingsSheets } from "../hooks/use-settings-sheets";

const SettingsScreen = () => {
  const { alarmTimeLabel, displayName, openAlarmTimeSheet, openNameSheet } =
    useSettingsSheets();

  return (
    <Screen padded={false} safeEdges={["top", "left", "right"]}>
      <ScreenHeader title="설정" className="px-screen" />
      <FnbScrollView
        className="mt-[12px] flex-1 px-screen"
        contentContainerStyle={{ gap: 30, paddingBottom: 24 }}
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

        {isDebugEnabled ? (
          <Link href="/debug-settings">debug settings 이동</Link>
        ) : null}
      </FnbScrollView>
    </Screen>
  );
};

export default SettingsScreen;

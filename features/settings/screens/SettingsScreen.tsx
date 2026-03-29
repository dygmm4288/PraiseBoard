import { Icon } from "@/assets/icons";
import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { View } from "react-native";
import SettingEnv from "../components/sections/setting-env";
import SettingInfo from "../components/sections/setting-info";
import SettingNotification from "../components/sections/setting-notification";
import SettingProfile from "../components/sections/setting-profile";

const SettingsScreen = () => {
  return (
    <Screen>
      <ScreenHeader left={<Icon name="ChevronLeft" />} title="설정" />
      <View className="flex flex-col gap-[24px] mt-[10px]">
        <SettingProfile />
        <SettingNotification />
        <SettingEnv />
        <SettingInfo />
      </View>
    </Screen>
  );
};

export default SettingsScreen;

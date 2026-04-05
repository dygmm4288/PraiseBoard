import { Icon } from "@/assets/icons";
import { useUser } from "@/services/user";
import { Screen } from "@/shared/ui";
import ScreenHeader from "@/shared/ui/screen-header";
import { useNavigation } from "expo-router";
import { Pressable, View } from "react-native";
import SettingAuth from "../components/sections/setting-auth";
import SettingEnv from "../components/sections/setting-env";
import SettingInfo from "../components/sections/setting-info";
import SettingNotification from "../components/sections/setting-notification";
import SettingProfile from "../components/sections/setting-profile";

const SettingsScreen = () => {
  const { authState } = useUser();
  const navigation = useNavigation();
  return (
    <Screen>
      <ScreenHeader
        left={
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="ChevronLeft" />
          </Pressable>
        }
        title="설정"
      />
      <View className="flex flex-col gap-[24px] mt-[10px]">
        <SettingProfile />
        <SettingNotification />
        <SettingEnv />
        <SettingInfo bottomBorderYn={authState === "anonymous"} />
        {authState !== "member" && <SettingAuth />}
      </View>
    </Screen>
  );
};

export default SettingsScreen;

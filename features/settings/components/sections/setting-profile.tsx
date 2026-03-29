import { useCurrentProfile, useUser } from "@/services/user";
import { Text, View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";

const SettingProfile = () => {
  const { profileId } = useUser();
  const { nickname, isLoading, errorMessage } = useCurrentProfile(profileId);
  return (
    <SettingSectionLayout title="내 정보">
      <View>
        <Text>profileId: {profileId ?? "-"}</Text>
        <Text>nickname: {nickname ?? "-"}</Text>
        <Text>loading: {isLoading ? "true" : "false"}</Text>
        <Text>error: {errorMessage ?? "-"}</Text>
      </View>
    </SettingSectionLayout>
  );
};

export default SettingProfile;

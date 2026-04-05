import { useCurrentProfile, useUser } from "@/services/user";
import { View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingInfoBox from "../setting-info-box";
import SettingLink from "../setting-link";

const SettingProfile = () => {
  const { profileId, authState } = useUser();
  const { nickname } = useCurrentProfile(profileId);
  return (
    <SettingSectionLayout title="내 정보">
      <SettingLink onLink={() => {}}>{nickname}</SettingLink>
      <View>
        {authState === "anonymous" && (
          <SettingInfoBox>
            {`지금은 모든 데이터가 임시로 저장되고 있어요
회원가입하면 데이터를 안전하게 보관할 수 있어요`}
          </SettingInfoBox>
        )}
      </View>
    </SettingSectionLayout>
  );
};

export default SettingProfile;

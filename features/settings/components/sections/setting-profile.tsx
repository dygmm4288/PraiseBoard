import { Icon } from "@/assets/icons";
import { useCurrentProfile, useUser } from "@/services/user";
import { AppText } from "@/shared/ui";
import { View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingInfoBox from "../setting-info-box";

const SettingProfile = () => {
  const { profileId, authState } = useUser();
  const { nickname } = useCurrentProfile(profileId);
  return (
    <SettingSectionLayout title="내 정보">
      <View className="flex flex-row justify-between">
        <AppText variant="body2" className="text-gray-700">
          {nickname}
        </AppText>
        <Icon name="ChevronRightSmall" width={5} height={10} />
      </View>
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

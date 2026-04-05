import SettingSectionLayout from "../layout/setting-section-layout";
import SettingLink from "../setting-link";

type Props = {
  bottomBorderYn: boolean;
};
const SettingInfo = ({ bottomBorderYn }: Props) => {
  const appVersion = "1.0.0";
  return (
    <SettingSectionLayout title="앱 정보" bottomBorderYn={bottomBorderYn}>
      <SettingLink onLink={() => {}}>약관</SettingLink>
      <SettingLink onLink={() => {}}>앱 버전 {appVersion}</SettingLink>
    </SettingSectionLayout>
  );
};

export default SettingInfo;

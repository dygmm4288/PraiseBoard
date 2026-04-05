import SettingSectionLayout from "../layout/setting-section-layout";
import SettingLink from "../setting-link";

const SettingAuth = () => {
  return (
    <SettingSectionLayout bottomBorderYn={false}>
      <SettingLink onLink={() => {}}>로그아웃</SettingLink>
      <SettingLink onLink={() => {}}>회원탈퇴</SettingLink>
    </SettingSectionLayout>
  );
};

export default SettingAuth;

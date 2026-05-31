import SettingSectionLayout from "../layout/setting-section-layout";
import SettingLink from "../setting-link";

type SettingProfileProps = {
  name: string;
  onEditName: () => void;
};

const SettingProfile = ({ name, onEditName }: SettingProfileProps) => {
  return (
    <SettingSectionLayout title="내 정보">
      <SettingLink label="이름" value={name} onLink={onEditName} />
    </SettingSectionLayout>
  );
};

export default SettingProfile;

import SettingSectionLayout from "../layout/setting-section-layout";
import SettingToggle from "../setting-toggle";

const SettingEnv = () => {
  return (
    <SettingSectionLayout title="환경">
      <SettingToggle
        label="앱 실행 중 진동"
        value={true}
        onToggle={async (value: boolean) => {}}
        disabled={false}
      />
    </SettingSectionLayout>
  );
};

export default SettingEnv;


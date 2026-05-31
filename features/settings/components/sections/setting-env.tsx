import { useState } from "react";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingToggle from "../setting-toggle";

const SettingEnv = () => {
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);

  return (
    <SettingSectionLayout title="환경">
      <SettingToggle
        label="앱 실행 중 진동"
        value={isVibrationEnabled}
        onToggle={async (value: boolean) => setIsVibrationEnabled(value)}
        disabled={false}
      />
    </SettingSectionLayout>
  );
};

export default SettingEnv;

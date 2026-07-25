import { useVibrationEnabled } from "@/shared/hooks/use-vibration-enabled";
import { toast } from "@/shared/toasts/toast";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingToggle from "../setting-toggle";

const SettingEnv = () => {
  const {
    isVibrationEnabled,
    isLoading,
    updateVibrationEnabled,
  } = useVibrationEnabled();

  const handleToggle = async (nextValue: boolean) => {
    try {
      await updateVibrationEnabled(nextValue);
    } catch {
      toast.error("진동 설정을 저장하는 중 오류가 발생했어요.");
    }
  };

  return (
    <SettingSectionLayout title="환경">
      <SettingToggle
        label="앱 실행 중 진동"
        value={isVibrationEnabled}
        onToggle={handleToggle}
        disabled={isLoading}
      />
    </SettingSectionLayout>
  );
};

export default SettingEnv;

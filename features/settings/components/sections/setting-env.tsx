import { useVibrationEnabled } from "@/shared/hooks/use-vibration-enabled";
import { toast } from "@/shared/toasts/toast";
import { Skeleton } from "@/shared/ui";
import { View } from "react-native";
import SettingSectionLayout from "../layout/setting-section-layout";
import SettingToggle from "../setting-toggle";

const SettingEnvSkeleton = () => (
  <View className="flex-row items-center justify-between px-[20px] py-[3px]">
    <Skeleton width={92} height={18} borderRadius={6} />
    <Skeleton width={39} height={24} borderRadius={100} />
  </View>
);

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
      {isLoading ? (
        <SettingEnvSkeleton />
      ) : (
        <SettingToggle
          label="앱 실행 중 진동"
          value={isVibrationEnabled}
          onToggle={handleToggle}
          disabled={false}
        />
      )}
    </SettingSectionLayout>
  );
};

export default SettingEnv;

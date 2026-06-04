import { AppText } from "@/shared/ui";
import { View } from "react-native";
import { STEPS } from "../../onboarding.steps";

type Props = {
  stepName: STEPS;
};

const STEP_LABEL = {
  name: "이름 설정",
  title: "습관 설정",
  limit: "목표 개수 설정",
  reward: "보상 설정",
  notification: "알림 설정",
} as Record<STEPS, string>;

const STEP_CNT_LABEL = {
  name: "STEP 1 / 5",
  title: "STEP 2 / 5",
  limit: "STEP 3 / 5",
  reward: "STEP 4 / 5",
  notification: "STEP 5 / 5",
} as Record<STEPS, string>;

const STEP_PROGRESS_CLASS = {
  name: "w-1/5",
  title: "w-2/5",
  limit: "w-3/5",
  reward: "w-4/5",
  notification: "w-full",
} as Record<STEPS, string>;

const OnboardHeader = ({ stepName }: Props) => {
  return (
    <View className="h-[45px] justify-between px-[8px]">
      <View className="flex-1 flex-row items-center justify-between">
        <AppText
          variant="custom"
          weight="bold"
          className="text-[18px] leading-[32px] tracking-[-0.18px] text-gray-900"
        >
          {STEP_LABEL[stepName]}
        </AppText>
        <AppText
          variant="custom"
          weight="semibold"
          className="text-[12px] leading-[20px] text-primary-500"
        >
          {STEP_CNT_LABEL[stepName]}
        </AppText>
      </View>
      <View className="h-[4px] overflow-hidden rounded-[10px] bg-primary-100">
        <View
          className={`h-full rounded-[10px] bg-primary-500 ${STEP_PROGRESS_CLASS[stepName]}`}
        />
      </View>
    </View>
  );
};

export default OnboardHeader;

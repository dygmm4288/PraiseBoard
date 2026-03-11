import { AppText } from "@/shared/ui";
import { View } from "react-native";
import { STEPS } from "../../onboarding.steps";

type Props = {
  stepName: STEPS;
};

const STEP_LABEL = {
  intro: "",
  name: "자기소개",
  title: "목표(유리병) 설정",
  limit: "구슬개수 설정",
  reward: "보상 설정",
  notification: "알림 설정",
} as Record<STEPS, string>;

const STEP_CNT_LABEL = {
  intro: "",
  name: "1/5",
  title: "2/5",
  limit: "3/5",
  reward: "4/5",
  notification: "5/5",
} as Record<STEPS, string>;

const OnboardHeader = ({ stepName }: Props) => {
  return (
    <View className="flex flex-row gap-[6px] justify-center items-center">
      <AppText variant="button1">{STEP_LABEL[stepName]}</AppText>
      <AppText variant="body2" className="text-gray-300">
        {STEP_CNT_LABEL[stepName]}
      </AppText>
    </View>
  );
};

export default OnboardHeader;

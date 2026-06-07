import { AppText } from "@/shared/ui";
import { useEffect } from "react";
import { LayoutChangeEvent, View } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { STEP_INDEX, STEPS, TOTAL_STEPS } from "../../onboarding.steps";

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

const OnboardHeader = ({ stepName }: Props) => {
  const progress = useSharedValue((STEP_INDEX[stepName] + 1) / TOTAL_STEPS);
  const trackWidth = useSharedValue(0);

  useEffect(() => {
    const nextProgress = (STEP_INDEX[stepName] + 1) / TOTAL_STEPS;
    progress.value = withTiming(nextProgress, {
      duration: 240,
      reduceMotion: ReduceMotion.System,
    });
  }, [progress, stepName]);

  const handleTrackLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    trackWidth.value = nativeEvent.layout.width;
  };

  const fillStyle = useAnimatedStyle(() => ({
    opacity: trackWidth.value > 0 ? 1 : 0,
    width: trackWidth.value * progress.value,
  }));

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
      <View
        className="h-[4px] overflow-hidden rounded-[10px] bg-primary-100"
        onLayout={handleTrackLayout}
      >
        <Animated.View
          className="h-full rounded-[10px] bg-primary-500"
          style={fillStyle}
        />
      </View>
    </View>
  );
};

export default OnboardHeader;

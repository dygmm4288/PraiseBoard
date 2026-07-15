import { COLORS } from "@/shared/theme";
import { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  interpolateColor,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const DOT_BASE_STYLE: ViewStyle = {
  width: 6,
  height: 6,
  borderRadius: 999,
  backgroundColor: COLORS.neutral[500],
};

const ChatTypingDot = ({ index }: { index: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withDelay(
      index * 150,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, reduceMotion: ReduceMotion.Never }),
          withTiming(0, { duration: 400, reduceMotion: ReduceMotion.Never }),
        ),
        -1,
        false,
        undefined,
        ReduceMotion.Never,
      ),
    );
    return () => cancelAnimation(progress);
  }, [index, progress]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [COLORS.neutral[300], COLORS.neutral[500]],
    ),
  }));

  return <Animated.View style={[DOT_BASE_STYLE, style]} />;
};

export default ChatTypingDot;

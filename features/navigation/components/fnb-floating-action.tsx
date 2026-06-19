import { COLOR } from "@/shared/constants/colors.constant";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const FAB_BASE_COLOR = "#5A19BF";
const FAB_PRESSED_COLOR = "#5117AC";

const FnbFloatingAction = ({ onPress }: Props) => {
  const insets = useSafeAreaInsets();
  const mounted = useSharedValue(0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    mounted.value = withTiming(1, { duration: 280 });
  }, [mounted]);

  const animatedStyle = useAnimatedStyle(() => {
    const mountTranslateY = interpolate(mounted.value, [0, 1], [6, 0]);
    const pressScale = interpolate(pressed.value, [0, 1], [1, 0.97]);

    return {
      backgroundColor: interpolateColor(
        pressed.value,
        [0, 1],
        [FAB_BASE_COLOR, FAB_PRESSED_COLOR],
      ),
      opacity: mounted.value,
      elevation: interpolate(pressed.value, [0, 1], [14, 8]),
      shadowOffset: {
        width: 0,
        height: interpolate(pressed.value, [0, 1], [8, 3]),
      },
      shadowOpacity: interpolate(pressed.value, [0, 1], [0.38, 0.34]),
      shadowRadius: interpolate(pressed.value, [0, 1], [22, 10]),
      transform: [{ translateY: mountTranslateY }, { scale: pressScale }],
    };
  });

  const handlePressIn = () => {
    pressed.value = withTiming(1, { duration: 120 });
  };

  const handlePressOut = () => {
    pressed.value = withSpring(0, {
      damping: 18,
      stiffness: 260,
      mass: 0.7,
    });
  };

  return (
    <AnimatedPressable
      accessibilityLabel="보드 추가"
      accessibilityRole="button"
      className="absolute right-[34px] h-[54px] w-[54px] items-center justify-center rounded-[50px]"
      style={[styles.container, { bottom: insets.bottom + 97 }, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View className="absolute h-[2px] w-[24px] rounded-[1px] bg-white" />
      <View className="absolute h-[24px] w-[2px] rounded-[1px] bg-white" />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 14,
    shadowColor: COLOR.primary[70],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 11,
  },
});

export default FnbFloatingAction;

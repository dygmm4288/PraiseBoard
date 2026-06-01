import { cn } from "@/shared/utils/cn";
import { useEffect } from "react";
import { Pressable, PressableProps } from "react-native";
import Animated, {
  ReduceMotion,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLOR } from "../constants/colors.constant";

const TRACK_WIDTH = 39;
const TRACK_PADDING = 2;
const KNOB_SIZE = 20;
const KNOB_TRANSLATE_X = TRACK_WIDTH - KNOB_SIZE - TRACK_PADDING * 2;

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
  activeColor?: string;
  inactiveColor?: string;
} & Omit<PressableProps, "onPress">;

const Toggle = ({
  value,
  onValueChange,
  className,
  disabled = false,
  activeColor = COLOR.primary[500],
  inactiveColor = COLOR.gray[300],
  ...props
}: ToggleProps) => {
  const isDisabled = !!disabled;
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, {
      duration: 180,
      reduceMotion: ReduceMotion.System,
    });
  }, [progress, value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor],
    ),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * KNOB_TRANSLATE_X }],
  }));

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: isDisabled }}
      className={cn(
        "relative h-[24px] w-[39px] overflow-hidden rounded-[100px]",
        isDisabled && "opacity-50",
        className,
      )}
      onPress={() => onValueChange(!value)}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute inset-0 rounded-[100px]"
        style={trackStyle}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: TRACK_PADDING,
            left: TRACK_PADDING,
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            backgroundColor: COLOR.white,
            shadowColor: COLOR.black,
            shadowOpacity: 0.12,
            shadowRadius: 4,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            elevation: 2,
          },
          knobStyle,
        ]}
      />
    </Pressable>
  );
};

export default Toggle;

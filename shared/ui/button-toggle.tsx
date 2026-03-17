import { cn } from "@/shared/utils/cn";
import { ReactNode, useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const TRACK_HEIGHT = 30;
const TRACK_RADIUS = 8;
const INDICATOR_RADIUS = 7;
const TRACK_PADDING = 2;
const DEFAULT_SEGMENT_WIDTH = 27;
const TRACK_BACKGROUND = "#E3E3E6";
const INDICATOR_BACKGROUND = "#FFFFFF";

type Option<T> = {
  value: T;
  render: (active: boolean) => ReactNode;
  accessibilityLabel?: string;
};

type ButtonToggleProps<T> = {
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
  width?: number;
  disabled?: boolean;
};

const ToggleOptionContent = ({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) => {
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: 180,
      reduceMotion: ReduceMotion.System,
    });
  }, [active, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.62 + progress.value * 0.38,
    transform: [{ scale: 0.96 + progress.value * 0.04 }],
  }));

  return (
    <Animated.View style={style} className="items-center justify-center">
      {children}
    </Animated.View>
  );
};

const ButtonToggle = <T,>({
  value,
  options,
  onChange,
  className,
  width,
  disabled = false,
}: ButtonToggleProps<T>) => {
  const optionCount = options.length;
  const safeOptionCount = Math.max(optionCount, 1);
  const activeIndex = Math.max(
    options.findIndex((option) => Object.is(option.value, value)),
    0,
  );
  const resolvedWidth =
    width ?? safeOptionCount * DEFAULT_SEGMENT_WIDTH + TRACK_PADDING * 2;
  const indicatorWidth = (resolvedWidth - TRACK_PADDING * 2) / safeOptionCount;
  const indicatorOffset = useSharedValue(activeIndex * indicatorWidth);

  useEffect(() => {
    indicatorOffset.value = withSpring(activeIndex * indicatorWidth, {
      damping: 18,
      stiffness: 230,
      mass: 0.9,
      reduceMotion: ReduceMotion.System,
    });
  }, [activeIndex, indicatorOffset, indicatorWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: indicatorWidth,
    transform: [{ translateX: indicatorOffset.value }],
  }));

  if (optionCount === 0) return null;

  return (
    <View
      className={cn(
        "relative flex-row items-center overflow-hidden bg-[#E3E3E6] p-[2px]",
        className,
      )}
      style={{
        width: resolvedWidth,
        height: TRACK_HEIGHT,
        borderRadius: TRACK_RADIUS,
        backgroundColor: TRACK_BACKGROUND,
      }}
    >
      <Animated.View
        pointerEvents="none"
        className="absolute top-[2px] bottom-[2px]"
        style={[
          {
            left: TRACK_PADDING,
            borderRadius: INDICATOR_RADIUS,
            backgroundColor: INDICATOR_BACKGROUND,
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 3,
          },
          indicatorStyle,
        ]}
      />
      {options.map((option, index) => {
        const active = index === activeIndex;

        return (
          <Pressable
            key={index}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={option.accessibilityLabel}
            accessibilityState={{ disabled, selected: active }}
            className="items-center justify-center"
            style={{
              width: indicatorWidth,
              height: TRACK_HEIGHT - TRACK_PADDING * 2,
            }}
            onPress={() => onChange(option.value)}
          >
            <ToggleOptionContent active={active}>
              {option.render(active)}
            </ToggleOptionContent>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ButtonToggle;

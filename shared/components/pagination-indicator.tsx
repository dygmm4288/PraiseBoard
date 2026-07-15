import { COLORS } from "@/shared/theme";
import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  name?: string;
  totalCnt: number;
  currentIndex: number;
  activeColor?: string;
  inactiveColor?: string;
};

const INACTIVE = {
  width: 6,
  backgroundColor: COLORS.line.DEFAULT,
};

const ACTIVE = {
  width: 18,
  backgroundColor: COLORS.content.primary,
};

const DOT_BASE_STYLE: ViewStyle = {
  width: INACTIVE.width,
  height: 6,
  borderRadius: 10,
  backgroundColor: INACTIVE.backgroundColor,
};

const IndicatorItem = ({
  active,
  activeColor,
  inactiveColor,
}: {
  active: boolean;
  activeColor: string;
  inactiveColor: string;
}) => {
  const width = useSharedValue(active ? ACTIVE.width : INACTIVE.width);

  useEffect(() => {
    width.value = withTiming(active ? ACTIVE.width : INACTIVE.width, {
      duration: 220,
      reduceMotion: ReduceMotion.System,
    });
  }, [active, width]);

  const style = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <Animated.View
      style={[
        DOT_BASE_STYLE,
        {
          backgroundColor: active ? activeColor : inactiveColor,
        },
        style,
      ]}
    />
  );
};

const PaginationIndicator = ({
  name,
  totalCnt,
  currentIndex,
  activeColor = ACTIVE.backgroundColor,
  inactiveColor = INACTIVE.backgroundColor,
}: Props) => {
  return (
    <View className="h-[18px] flex-row items-center gap-[6px]">
      {Array.from({ length: totalCnt }, (_, i) => (
        <IndicatorItem
          key={`indicator-${name ?? ""}-${i}`}
          active={currentIndex === i}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
        />
      ))}
    </View>
  );
};

export default PaginationIndicator;

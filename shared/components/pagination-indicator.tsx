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
};

const INACTIVE = {
  width: 6,
  backgroundColor: "#d9d9d9",
};

const ACTIVE = {
  width: 18,
  backgroundColor: "#323234",
};

const DOT_BASE_STYLE: ViewStyle = {
  width: INACTIVE.width,
  height: 6,
  borderRadius: 10,
  backgroundColor: INACTIVE.backgroundColor,
};

const IndicatorItem = ({ active }: { active: boolean }) => {
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
          backgroundColor: active ? ACTIVE.backgroundColor : INACTIVE.backgroundColor,
        },
        style,
      ]}
    />
  );
};

const PaginationIndicator = ({ name, totalCnt, currentIndex }: Props) => {
  return (
    <View className="h-[18px] flex-row items-center gap-[6px]">
      {Array.from({ length: totalCnt }, (_, i) => (
        <IndicatorItem
          key={`indicator-${name ?? ""}-${i}`}
          active={currentIndex === i}
        />
      ))}
    </View>
  );
};

export default PaginationIndicator;

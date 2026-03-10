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

const INACTIVE_WIDTH = 6;
const ACTIVE_WIDTH = 18;

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

const PaginationIndicator = ({ active }: { active: boolean }) => {
  const progress = useSharedValue(active ? ACTIVE : INACTIVE);

  useEffect(() => {
    progress.value = withTiming(active ? ACTIVE : INACTIVE, {
      duration: 220,
      reduceMotion: ReduceMotion.System,
    });
  }, [active, progress]);

  const style = useAnimatedStyle(() => ({
    ...progress.value,
  }));

  return <Animated.View style={[DOT_BASE_STYLE, style]} />;
};

const IndicatorPaginationBar = ({ name, totalCnt, currentIndex }: Props) => {
  return (
    <View className="flex flex-row gap-[6px]">
      {Array.from({ length: totalCnt }, (_, i) => (
        <PaginationIndicator
          key={`indicator-${name ?? ""}-${i}`}
          active={currentIndex === i}
        />
      ))}
    </View>
  );
};

export default IndicatorPaginationBar;

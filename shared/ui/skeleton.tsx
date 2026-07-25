import { useEffect } from "react";
import { type DimensionValue, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SKELETON_BASE_COLOR = "#ECEAF2";
const SKELETON_SHIMMER_COLOR = "#D8D4E8";

type Props = {
  width?: DimensionValue;
  height: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
};

/** A non-interactive loading placeholder using the skeleton colors from Figma. */
const Skeleton = ({
  width = "100%",
  height,
  borderRadius = 8,
  style,
}: Props) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [SKELETON_BASE_COLOR, SKELETON_SHIMMER_COLOR],
    ),
  }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width, height, borderRadius }, animatedStyle, style]}
    />
  );
};

Skeleton.BaseColor = SKELETON_BASE_COLOR;
Skeleton.ShimmerColor = SKELETON_SHIMMER_COLOR;

export default Skeleton;

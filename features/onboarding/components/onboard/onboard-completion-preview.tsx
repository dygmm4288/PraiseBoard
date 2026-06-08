import { AppText } from "@/shared/ui";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import BoardItem from "@/features/board/components/board-item/board-item";
import type { BoardRecord } from "@/features/board/types";

type Props = {
  nickname?: string | null;
  board: BoardRecord;
  onDone?: () => void;
};

const OnboardCompletionPreview = ({
  nickname,
  board,
  onDone,
}: Props) => {
  const { height } = useWindowDimensions();
  const settled = useSharedValue(0);
  const displayName = nickname?.trim() || "사용자";
  const cardStartTop = Math.max(340, height * 0.48);
  const cardEndTop = 286;
  const titleStartTop = cardStartTop - 88;

  useEffect(() => {
    settled.value = withDelay(
      1500,
      withTiming(1, {
        duration: 850,
        easing: Easing.out(Easing.cubic),
      }),
    );

    if (!onDone) return;

    const doneTimer = setTimeout(onDone, 2700);

    return () => {
      clearTimeout(doneTimer);
    };
  }, [onDone, settled]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(settled.value, [0, 1], [1, 0]),
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(settled.value, [0, 0.65, 1], [1, 0, 0]),
    transform: [
      {
        translateY: interpolate(settled.value, [0, 1], [0, -14]),
      },
    ],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    top: interpolate(settled.value, [0, 1], [cardStartTop, cardEndTop]),
    transform: [
      {
        scale: interpolate(settled.value, [0, 1], [1.045, 1]),
      },
    ],
  }));

  return (
    <View className="absolute inset-0 z-10">
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, overlayStyle]}
      >
        <BlurView intensity={70} tint="light" style={StyleSheet.absoluteFill} />
        <View className="absolute inset-0 bg-[rgba(20,10,50,0.22)]" />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        className="absolute left-0 right-0 items-center px-screen"
        style={[{ top: titleStartTop }, titleStyle]}
      >
        <AppText
          variant="custom"
          weight="bold"
          className="text-center text-[18px] leading-[32px] tracking-[-0.18px] text-gray-900"
        >
          {`${displayName}의\n첫 습관이 준비됐어`}
        </AppText>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        className="absolute left-screen right-screen"
        style={cardStyle}
      >
        <BoardItem board={board} actionType="collect" />
      </Animated.View>
    </View>
  );
};

export default OnboardCompletionPreview;

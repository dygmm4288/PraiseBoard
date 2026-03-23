import BottomSheetHandle from "@/shared/components/bottom-sheet/bottom-sheet-handle";
import { PropsWithChildren, useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BoardSheetState } from "../../hooks/use-board-ui";

type BoardPanelProps = PropsWithChildren<{
  state: BoardSheetState;
  onChangeState: (state: BoardSheetState) => void;
}>;

const PANEL_HEIGHT_RATIO: Record<BoardSheetState, number> = {
  peek: 0.32,
  half: 0.4,
  full: 0.61,
};

const PANEL_STATES: BoardSheetState[] = ["peek", "half", "full"];

const NEXT_STATE: Record<BoardSheetState, BoardSheetState> = {
  peek: "half",
  half: "full",
  full: "peek",
};

const BoardPanel = ({ state, onChangeState, children }: BoardPanelProps) => {
  const { height: windowHeight } = useWindowDimensions();
  const height = Math.round(windowHeight * PANEL_HEIGHT_RATIO[state]);
  const animatedHeight = useSharedValue(height);
  const dragStartHeight = useSharedValue(height);
  const minHeight = Math.round(windowHeight * PANEL_HEIGHT_RATIO.peek);
  const maxHeight = Math.round(windowHeight * PANEL_HEIGHT_RATIO.full);

  useEffect(() => {
    animatedHeight.value = withSpring(height, {
      damping: 20,
      stiffness: 220,
      mass: 0.92,
      reduceMotion: ReduceMotion.System,
    });
  }, [animatedHeight, height]);

  const tapGesture = Gesture.Tap().onEnd(() => {
    runOnJS(onChangeState)(NEXT_STATE[state]);
  });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      dragStartHeight.value = animatedHeight.value;
    })
    .onUpdate((event) => {
      const nextHeight = dragStartHeight.value - event.translationY;
      animatedHeight.value = Math.min(
        maxHeight,
        Math.max(minHeight, nextHeight),
      );
    })
    .onEnd(() => {
      const nextState = PANEL_STATES.reduce((closestState, candidateState) => {
        const candidateHeight =
          windowHeight * PANEL_HEIGHT_RATIO[candidateState];
        const closestHeight = windowHeight * PANEL_HEIGHT_RATIO[closestState];

        return Math.abs(animatedHeight.value - candidateHeight) <
          Math.abs(animatedHeight.value - closestHeight)
          ? candidateState
          : closestState;
      }, PANEL_STATES[0]);

      runOnJS(onChangeState)(nextState);
    });

  const handleGesture = Gesture.Exclusive(panGesture, tapGesture);

  const style = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <Animated.View
      style={style}
      className="overflow-hidden bg-white rounded-t-[30px] -ml-[20px] -mr-[20px]"
    >
      <GestureDetector gesture={handleGesture}>
        <View
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel="보드 패널 높이 변경"
        >
          <BottomSheetHandle />
        </View>
      </GestureDetector>
      <View className="flex-1">{children}</View>
    </Animated.View>
  );
};

export default BoardPanel;

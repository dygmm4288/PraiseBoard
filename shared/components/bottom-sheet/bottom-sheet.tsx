import type {
  BottomSheetBackdropProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import BottomSheet, {
  BottomSheetBackdrop,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet";
import type { ElementRef, PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetHandle from "./bottom-sheet-handle";

type Props = PropsWithChildren<{
  index: number;
  onChangeIndex: (index: number) => void;
  snapPoints?: readonly (string | number)[];
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  enableBackdrop?: boolean;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  keyboardBlurBehavior?: BottomSheetProps["keyboardBlurBehavior"];
  enableBlurKeyboardOnGesture?: BottomSheetProps["enableBlurKeyboardOnGesture"];
  androidKeyboardInputMode?: BottomSheetProps["android_keyboardInputMode"];
}>;

const DEFAULT_SNAP_POINTS = ["25%", "50%", "90%"] as const;
const TOP_INSET_OFFSET = 8;
const ANIMATION_DURATION = 500;

const AppBottomSheet = ({
  index,
  onChangeIndex,
  children,
  snapPoints = [...DEFAULT_SNAP_POINTS],
  enablePanDownToClose = true,
  enableContentPanningGesture = true,
  enableBackdrop = true,
  keyboardBehavior = "interactive",
  keyboardBlurBehavior = "restore",
  enableBlurKeyboardOnGesture = true,
  androidKeyboardInputMode = "adjustResize",
}: Props) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<ElementRef<typeof BottomSheet>>(null);
  const lastEmittedIndexRef = useRef<number | null>(null);
  const initialIndexRef = useRef(index);
  const resolvedSnapPoints = useMemo(() => [...snapPoints], [snapPoints]);
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: ANIMATION_DURATION,
    easing: Easing.bezier(0.32, 0.72, 0, 1),
  });

  const handleChange = useCallback(
    (index: number) => {
      lastEmittedIndexRef.current = index;
      onChangeIndex(index);
    },
    [onChangeIndex],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) =>
      enableBackdrop ? (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
          accessibilityRole="button"
          accessibilityLabel="바텀시트 닫기"
        />
      ) : null,
    [enableBackdrop],
  );

  useEffect(() => {
    if (lastEmittedIndexRef.current === index) {
      lastEmittedIndexRef.current = null;
      return;
    }

    if (index >= 0) {
      bottomSheetRef.current?.snapToIndex(index);
      return;
    }

    bottomSheetRef.current?.close();
  }, [index]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={initialIndexRef.current}
      snapPoints={resolvedSnapPoints}
      topInset={insets.top + TOP_INSET_OFFSET}
      animateOnMount
      animationConfigs={animationConfigs}
      enableDynamicSizing={false}
      enablePanDownToClose={enablePanDownToClose}
      enableContentPanningGesture={enableContentPanningGesture}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      enableBlurKeyboardOnGesture={enableBlurKeyboardOnGesture}
      android_keyboardInputMode={androidKeyboardInputMode}
      onChange={handleChange}
      handleComponent={BottomSheetHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
      }}
    >
      {children}
    </BottomSheet>
  );
};

export default AppBottomSheet;

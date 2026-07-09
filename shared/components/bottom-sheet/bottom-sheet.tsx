import type {
  BottomSheetBackdropProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet";
import type { ElementRef, PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetHandle from "./bottom-sheet-handle";

type Props = {
  index: number;
  onChangeIndex: (index: number) => void;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  enableBackdrop?: boolean;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  androidKeyboardInputMode?: BottomSheetProps["android_keyboardInputMode"];
  onRequestClose?: () => void;
} & PropsWithChildren;

const DEFAULT_SNAP_POINTS = ["25%", "50%", "90%"] as const;
const TOP_INSET_OFFSET = 8;
const ANIMATION_DURATION = 500;

const AppBottomSheet = ({
  index,
  onChangeIndex,
  children,
  keyboardBehavior,
  snapPoints = [...DEFAULT_SNAP_POINTS],
  enablePanDownToClose = true,
  enableContentPanningGesture = true,
  enableBackdrop = true,
  androidKeyboardInputMode = "adjustResize",
  onRequestClose,
}: Props) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<ElementRef<typeof BottomSheet>>(null);
  const lastEmittedIndexRef = useRef<number | null>(null);
  const [initialIndex] = useState(index);
  const resolvedSnapPoints = useMemo(() => snapPoints, [snapPoints]);
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
          accessibilityLabel="닫기"
          onPress={onRequestClose}
        />
      ) : null,
    [enableBackdrop, onRequestClose],
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
      index={initialIndex}
      snapPoints={resolvedSnapPoints}
      topInset={insets.top + TOP_INSET_OFFSET}
      animateOnMount
      animationConfigs={animationConfigs}
      enableDynamicSizing={false}
      enablePanDownToClose={enablePanDownToClose}
      enableContentPanningGesture={enableContentPanningGesture}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior="none"
      android_keyboardInputMode={androidKeyboardInputMode}
      onChange={handleChange}
      handleComponent={BottomSheetHandle}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
      }}
    >
      <BottomSheetView className="flex-1">{children}</BottomSheetView>
    </BottomSheet>
  );
};

export default AppBottomSheet;

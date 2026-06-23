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
import { Keyboard } from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetHandle from "./bottom-sheet-handle";

type Props = {
  index: number;
  onChangeIndex: (index: number) => void;
  snapPoints?: (string | number)[];
  enablePanDownToClose?: boolean;
  enableBackdrop?: boolean;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
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
  enableBackdrop = true,
}: Props) => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<ElementRef<typeof BottomSheet>>(null);
  const lastEmittedIndexRef = useRef<number | null>(null);
  const controlledIndexRef = useRef(index);
  const restoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [initialIndex] = useState(index);
  const resolvedSnapPoints = useMemo(() => snapPoints, [snapPoints]);
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: ANIMATION_DURATION,
    easing: Easing.bezier(0.32, 0.72, 0, 1),
  });

  controlledIndexRef.current = index;

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

  useEffect(() => {
    if (!keyboardBehavior) {
      return;
    }

    const restoreControlledIndex = () => {
      const targetIndex = controlledIndexRef.current;

      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current);
      }

      restoreTimerRef.current = setTimeout(() => {
        if (targetIndex >= 0) {
          bottomSheetRef.current?.snapToIndex(targetIndex);
        } else {
          bottomSheetRef.current?.close();
        }
      }, 50);
    };

    const subscription = Keyboard.addListener(
      "keyboardDidHide",
      restoreControlledIndex,
    );

    return () => {
      subscription.remove();

      if (restoreTimerRef.current) {
        clearTimeout(restoreTimerRef.current);
        restoreTimerRef.current = null;
      }
    };
  }, [keyboardBehavior]);

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
      enableBlurKeyboardOnGesture
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
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

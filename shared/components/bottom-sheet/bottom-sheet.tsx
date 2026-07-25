import type {
  BottomSheetBackdropProps,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet";
import type { ElementRef, PropsWithChildren } from "react";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { Easing, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isDebugEnabled } from "@/shared/constants/environment";
import BottomSheetHandle from "./bottom-sheet-handle";

type Props = PropsWithChildren<{
  initialIndex: number;
  onChange?: (index: number) => void;
  onDismiss: () => void;
  snapPoints: readonly (string | number)[];
  enablePanDownToClose?: boolean;
  enableContentPanningGesture?: boolean;
  enableBackdrop?: boolean;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  keyboardBlurBehavior?: BottomSheetProps["keyboardBlurBehavior"];
  enableBlurKeyboardOnGesture?: BottomSheetProps["enableBlurKeyboardOnGesture"];
  androidKeyboardInputMode?: BottomSheetProps["android_keyboardInputMode"];
  onRequestClose: () => void;
}>;

export type AppBottomSheetRef = ElementRef<typeof BottomSheetModal>;

const TOP_INSET_OFFSET = 8;
const ANIMATION_DURATION = 500;

const AppBottomSheet = forwardRef<AppBottomSheetRef, Props>(
  function AppBottomSheet(
    {
      initialIndex,
      onChange,
      onDismiss,
      children,
      snapPoints,
      enablePanDownToClose = true,
      enableContentPanningGesture = true,
      enableBackdrop = true,
      keyboardBehavior = "interactive",
      keyboardBlurBehavior = "restore",
      enableBlurKeyboardOnGesture = true,
      androidKeyboardInputMode = "adjustResize",
      onRequestClose,
    },
    ref,
  ) {
    const insets = useSafeAreaInsets();
    const resolvedSnapPoints = useMemo(() => [...snapPoints], [snapPoints]);
    const animatedIndex = useSharedValue(initialIndex);
    const animatedPosition = useSharedValue(0);
    const lastChangeRef = useRef({ index: initialIndex, position: 0 });
    const restoreCandidateIndexRef = useRef(initialIndex);
    const animationConfigs = useBottomSheetTimingConfigs({
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });

    const logKeyboardTrace = useCallback(
      (event: string, details: Record<string, unknown> = {}) => {
        if (!isDebugEnabled) {
          return;
        }

        console.info("[BottomSheetKeyboardTrace]", event, {
          snapPoints: resolvedSnapPoints,
          keyboardBehavior,
          keyboardBlurBehavior,
          lastChange: lastChangeRef.current,
          appRestoreCandidateIndex: restoreCandidateIndexRef.current,
          animatedIndex: animatedIndex.value,
          animatedPosition: animatedPosition.value,
          ...details,
        });
      },
      [
        animatedIndex,
        animatedPosition,
        keyboardBehavior,
        keyboardBlurBehavior,
        resolvedSnapPoints,
      ],
    );

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) =>
        enableBackdrop ? (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.5}
            pressBehavior="none"
            accessible={false}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="바텀시트 닫기"
              style={StyleSheet.absoluteFill}
              onPress={onRequestClose}
            />
          </BottomSheetBackdrop>
        ) : null,
      [enableBackdrop, onRequestClose],
    );

    const handleChange = useCallback(
      (index: number, position: number) => {
        lastChangeRef.current = { index, position };
        logKeyboardTrace("onChange", { index, position });
        onChange?.(index);
      },
      [logKeyboardTrace, onChange],
    );

    const handleAnimate = useCallback(
      (
        fromIndex: number,
        toIndex: number,
        fromPosition: number,
        toPosition: number,
      ) => {
        logKeyboardTrace("onAnimate", {
          fromIndex,
          toIndex,
          fromPosition,
          toPosition,
        });
      },
      [logKeyboardTrace],
    );

    useEffect(() => {
      if (!isDebugEnabled) {
        return;
      }

      const handleKeyboardWillShow = () => {
        restoreCandidateIndexRef.current = lastChangeRef.current.index;
        logKeyboardTrace("keyboardWillShow");
      };
      const handleKeyboardDidShow = () => {
        logKeyboardTrace("keyboardDidShow");
      };
      const handleKeyboardWillHide = () => {
        logKeyboardTrace("keyboardWillHide");
      };
      const handleKeyboardDidHide = () => {
        logKeyboardTrace("keyboardDidHide");
      };

      const subscriptions = [
        Keyboard.addListener("keyboardWillShow", handleKeyboardWillShow),
        Keyboard.addListener("keyboardDidShow", handleKeyboardDidShow),
        Keyboard.addListener("keyboardWillHide", handleKeyboardWillHide),
        Keyboard.addListener("keyboardDidHide", handleKeyboardDidHide),
      ];

      logKeyboardTrace("mounted", { initialIndex });

      return () => {
        subscriptions.forEach((subscription) => subscription.remove());
      };
    }, [initialIndex, logKeyboardTrace]);

    return (
      <BottomSheetModal
        ref={ref}
        index={initialIndex}
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
        animatedIndex={animatedIndex}
        animatedPosition={animatedPosition}
        onChange={handleChange}
        onAnimate={handleAnimate}
        onDismiss={onDismiss}
        handleComponent={BottomSheetHandle}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          borderTopLeftRadius: 38,
          borderTopRightRadius: 38,
        }}
      >
        {children}
      </BottomSheetModal>
    );
  },
);

export default AppBottomSheet;

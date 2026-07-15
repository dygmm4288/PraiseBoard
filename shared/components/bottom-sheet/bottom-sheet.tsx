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
import { forwardRef, useCallback, useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Easing } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    const animationConfigs = useBottomSheetTimingConfigs({
      duration: ANIMATION_DURATION,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) =>
        enableBackdrop ? (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            opacity={0.5}
            pressBehavior="none"
            accessibilityRole="button"
            accessibilityLabel="바텀시트 닫기"
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
        onChange={onChange}
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

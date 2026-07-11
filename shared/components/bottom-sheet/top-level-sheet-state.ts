import type { BottomSheetProps } from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";

export type DismissTopLevelSheetOptions = {
  runOnClose?: boolean;
};

export type TopLevelSheetConfig = {
  children: ReactNode;
  snapPoints: readonly (string | number)[];
  initialIndex?: number;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  keyboardBlurBehavior?: BottomSheetProps["keyboardBlurBehavior"];
  enableBlurKeyboardOnGesture?: BottomSheetProps["enableBlurKeyboardOnGesture"];
  androidKeyboardInputMode?: BottomSheetProps["android_keyboardInputMode"];
  enableContentPanningGesture?: BottomSheetProps["enableContentPanningGesture"];
  onClose?: () => void;
};

export type TopLevelSheetState = {
  presentationId: number;
  config: TopLevelSheetConfig | null;
  index: number;
  closeEffect: (() => void) | null;
  runOnCloseAfterDismiss: boolean | null;
};

export const getClosedSheetState = (
  presentationId = 0,
): TopLevelSheetState => ({
  presentationId,
  config: null,
  index: -1,
  closeEffect: null,
  runOnCloseAfterDismiss: null,
});

export const getSafeInitialIndex = (config: TopLevelSheetConfig) => {
  const maxIndex = config.snapPoints.length - 1;

  if (maxIndex < 0) {
    return -1;
  }

  const initialIndex = config.initialIndex ?? 0;

  if (!Number.isInteger(initialIndex)) {
    return 0;
  }

  return Math.min(Math.max(initialIndex, 0), maxIndex);
};

export const presentTopLevelSheetState = (
  current: TopLevelSheetState,
  config: TopLevelSheetConfig,
) => {
  if (config.snapPoints.length === 0) {
    return getClosedSheetState(current.presentationId);
  }

  return {
    presentationId: current.presentationId + 1,
    config,
    index: getSafeInitialIndex(config),
    closeEffect: null,
    runOnCloseAfterDismiss: null,
  };
};

export const requestDismissTopLevelSheetState = (
  current: TopLevelSheetState,
) => {
  if (!current.config) {
    return current;
  }

  return {
    ...current,
    index: -1,
    closeEffect: null,
    runOnCloseAfterDismiss: true,
  };
};

export const updateTopLevelSheetIndexState = (
  current: TopLevelSheetState,
  index: number,
) => {
  if (
    !current.config ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= current.config.snapPoints.length
  ) {
    return current;
  }

  return { ...current, index };
};

export const clearTopLevelSheetState = (
  current: TopLevelSheetState,
  runOnClose = true,
) => {
  if (!current.config) {
    return current;
  }

  const shouldRunOnClose = current.runOnCloseAfterDismiss ?? runOnClose;

  return {
    ...getClosedSheetState(current.presentationId),
    closeEffect: shouldRunOnClose ? (current.config.onClose ?? null) : null,
  };
};

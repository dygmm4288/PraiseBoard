import type { BottomSheetProps } from "@gorhom/bottom-sheet";
import type { ReactNode } from "react";

export type TopLevelSheetControls = {
  dismiss: () => void;
};

export type TopLevelSheetConfig = {
  sheetKey: string;
  renderContent: (controls: TopLevelSheetControls) => ReactNode;
  snapPoints: readonly (string | number)[];
  initialIndex?: number;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  keyboardBlurBehavior?: BottomSheetProps["keyboardBlurBehavior"];
  enableBlurKeyboardOnGesture?: BottomSheetProps["enableBlurKeyboardOnGesture"];
  androidKeyboardInputMode?: BottomSheetProps["android_keyboardInputMode"];
  enableContentPanningGesture?: BottomSheetProps["enableContentPanningGesture"];
  onClose?: () => void;
};

export type TopLevelSheetPresentation = {
  id: number;
  config: TopLevelSheetConfig;
};

export const getSafeInitialIndex = (config: TopLevelSheetConfig) => {
  const maxIndex = config.snapPoints.length - 1;

  const initialIndex = config.initialIndex ?? 0;

  if (!Number.isInteger(initialIndex)) {
    return 0;
  }

  return Math.min(Math.max(initialIndex, 0), maxIndex);
};

export const hasSnapPoints = (config: TopLevelSheetConfig) =>
  config.snapPoints.length > 0;

export const hasSheetKey = (config: TopLevelSheetConfig) =>
  config.sheetKey.trim().length > 0;

export const getDismissalResult = (
  activePresentation: TopLevelSheetPresentation | null,
  pendingPresentation: TopLevelSheetPresentation | null,
  dismissedPresentationId: number,
) => {
  if (activePresentation?.id !== dismissedPresentationId) {
    return null;
  }

  return {
    dismissedPresentation: activePresentation,
    nextPresentation: pendingPresentation,
  };
};

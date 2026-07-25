export const TOAST_BOTTOM_GAP = 16;

const toSafeOffset = (value: number | null | undefined) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;

  return Math.max(0, value);
};

type ToastBottomOffsetInput = {
  bottomSafeAreaInset?: number | null;
  fnbClearance?: number | null;
  keyboardHeight?: number | null;
};

/**
 * Keyboard is the active bottom boundary while it is visible. Otherwise the
 * floating navigation bar (when present) or safe area is the boundary.
 */
export const resolveToastBottomOffset = ({
  bottomSafeAreaInset,
  fnbClearance,
  keyboardHeight,
}: ToastBottomOffsetInput) => {
  const safeArea = toSafeOffset(bottomSafeAreaInset);
  const keyboard = toSafeOffset(keyboardHeight);

  if (keyboard > 0) {
    return safeArea + TOAST_BOTTOM_GAP + keyboard;
  }

  return Math.max(safeArea, toSafeOffset(fnbClearance)) + TOAST_BOTTOM_GAP;
};

import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { useVibrationEnabled } from "@/shared/hooks/use-vibration-enabled";

export const useStickerCollectionFeedback = () => {
  const { isVibrationEnabled, isLoading } = useVibrationEnabled();

  return useCallback(() => {
    if (isLoading || !isVibrationEnabled) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [isLoading, isVibrationEnabled]);
};

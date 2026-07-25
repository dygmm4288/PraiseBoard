import { localStorage } from "@/infra/storage";
import { useCallback, useEffect, useState } from "react";

const VIBRATION_ENABLED_STORAGE_KEY = "vibration_enabled";

export const useVibrationEnabled = () => {
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVibrationEnabled = async () => {
      try {
        const storedValue = await localStorage.getItem(
          VIBRATION_ENABLED_STORAGE_KEY,
        );
        setIsVibrationEnabled(storedValue === "true");
      } finally {
        setIsLoading(false);
      }
    };

    void loadVibrationEnabled();
  }, []);

  const updateVibrationEnabled = useCallback(async (nextValue: boolean) => {
    await localStorage.setItem(
      VIBRATION_ENABLED_STORAGE_KEY,
      String(nextValue),
    );
    setIsVibrationEnabled(nextValue);
  }, []);

  return {
    isVibrationEnabled,
    isLoading,
    updateVibrationEnabled,
  };
};

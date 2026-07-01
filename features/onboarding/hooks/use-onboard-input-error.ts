import { useCallback, useEffect, useRef, useState } from "react";

const INPUT_ERROR_VISIBILITY_TIME = 2000;

export type OnboardInputError = {
  id: number;
  message: string;
};

const useOnboardInputError = () => {
  const [inputError, setInputError] = useState<OnboardInputError | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hideInputError = useCallback(() => {
    clearTimer();
    setInputError(null);
  }, [clearTimer]);

  const showInputError = useCallback(
    (message: string) => {
      clearTimer();
      setInputError({ id: Date.now(), message });
      timeoutRef.current = setTimeout(() => {
        setInputError(null);
        timeoutRef.current = null;
      }, INPUT_ERROR_VISIBILITY_TIME);
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  return {
    inputError,
    showInputError,
    hideInputError,
  };
};

export default useOnboardInputError;

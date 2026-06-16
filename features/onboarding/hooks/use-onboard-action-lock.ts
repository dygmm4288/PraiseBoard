import { useCallback, useRef, useState } from "react";

const useOnboardActionLock = () => {
  const lockedRef = useRef(false);
  const [disabled, setDisabled] = useState(false);

  const reset = useCallback(() => {
    lockedRef.current = false;
    setDisabled(false);
  }, []);

  const guard = useCallback(
    <Args extends unknown[], Result>(
      action: (...args: Args) => Result | Promise<Result>,
    ) => {
      return async (...args: Args): Promise<Awaited<Result> | undefined> => {
        if (lockedRef.current) return undefined;

        lockedRef.current = true;
        setDisabled(true);

        try {
          return await action(...args);
        } catch (error) {
          reset();
          throw error;
        }
      };
    },
    [reset],
  );

  return {
    disabled,
    guard,
    reset,
  };
};

export default useOnboardActionLock;

import AppBottomSheet from "@/shared/components/bottom-sheet/bottom-sheet";
import { clamp } from "@/shared/utils/number";
import { BottomSheetProps } from "@gorhom/bottom-sheet";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type DismissTopLevelSheetOptions = {
  runOnClose?: boolean;
};

type TopLevelSheetConfig = {
  children: ReactNode;
  snapPoints: (string | number)[];
  initialIndex?: number;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  androidKeyboardInputMode?: BottomSheetProps["android_keyboardInputMode"];
  onClose?: () => void;
};

type TopLevelSheetContextValue = {
  presentTopLevelSheet: (config: TopLevelSheetConfig) => void;
  dismissTopLevelSheet: (options?: DismissTopLevelSheetOptions) => void;
};

type TopLevelSheetState = {
  config: TopLevelSheetConfig | null;
  index: number;
  closeEffect: (() => void) | null;
  runOnCloseAfterDismiss: boolean | null;
};

const TopLevelSheetContext = createContext<TopLevelSheetContextValue | null>(
  null,
);

const getSafeInitialIndex = (config: TopLevelSheetConfig) => {
  const maxIndex = config.snapPoints.length - 1;

  if (maxIndex < 0) {
    return -1;
  }

  const initialIndex = config.initialIndex ?? 0;

  if (!Number.isInteger(initialIndex)) {
    return 0;
  }

  return clamp(initialIndex, 0, maxIndex);
};

const getSafeCurrentIndex = (
  config: TopLevelSheetConfig,
  currentIndex: number,
) => {
  const maxIndex = config.snapPoints.length - 1;

  if (maxIndex < 0) {
    return -1;
  }

  if (!Number.isInteger(currentIndex) || currentIndex < 0) {
    return getSafeInitialIndex(config);
  }

  return Math.min(currentIndex, maxIndex);
};

const getClosedSheetState = (): TopLevelSheetState => ({
  config: null,
  index: -1,
  closeEffect: null,
  runOnCloseAfterDismiss: null,
});

export const TopLevelSheetProvider = ({ children }: PropsWithChildren) => {
  const [sheetState, setSheetState] =
    useState<TopLevelSheetState>(getClosedSheetState);

  const presentTopLevelSheet = useCallback((config: TopLevelSheetConfig) => {
    setSheetState((current) => {
      if (config.snapPoints.length === 0) {
        return getClosedSheetState();
      }

      return {
        config,
        index: current.config
          ? getSafeCurrentIndex(config, current.index)
          : getSafeInitialIndex(config),
        closeEffect: null,
        runOnCloseAfterDismiss: null,
      };
    });
  }, []);

  const dismissTopLevelSheet = useCallback(
    (options?: DismissTopLevelSheetOptions) => {
      setSheetState((current) => {
        if (!current.config) {
          return current;
        }

        return {
          ...current,
          index: -1,
          closeEffect: null,
          runOnCloseAfterDismiss: options?.runOnClose ?? false,
        };
      });
    },
    [],
  );

  const clearTopLevelSheet = useCallback((runOnClose: boolean) => {
    setSheetState((current) => {
      const shouldRunOnClose = current.runOnCloseAfterDismiss ?? runOnClose;

      return {
        ...getClosedSheetState(),
        closeEffect: shouldRunOnClose
          ? (current.config?.onClose ?? null)
          : null,
      };
    });
  }, []);

  const handleChangeIndex = useCallback(
    (index: number) => {
      if (index === -1) {
        clearTopLevelSheet(true);
        return;
      }

      setSheetState((current) => {
        if (
          !current.config ||
          !Number.isInteger(index) ||
          index < 0 ||
          index >= current.config.snapPoints.length
        ) {
          return current;
        }

        return { ...current, index };
      });
    },
    [clearTopLevelSheet],
  );

  const handleRequestClose = useCallback(() => {
    const onClose = sheetState.config?.onClose;

    if (onClose) {
      onClose();
      return;
    }

    dismissTopLevelSheet();
  }, [dismissTopLevelSheet, sheetState.config]);

  useEffect(() => {
    if (!sheetState.closeEffect) {
      return;
    }

    const closeEffect = sheetState.closeEffect;

    closeEffect();
    setSheetState((current) =>
      current.closeEffect === closeEffect
        ? { ...current, closeEffect: null }
        : current,
    );
  }, [sheetState.closeEffect]);

  const value = useMemo(
    () => ({
      presentTopLevelSheet,
      dismissTopLevelSheet,
    }),
    [dismissTopLevelSheet, presentTopLevelSheet],
  );

  return (
    <TopLevelSheetContext.Provider value={value}>
      {children}
      {sheetState.config ? (
        <AppBottomSheet
          index={sheetState.index}
          onChangeIndex={handleChangeIndex}
          snapPoints={sheetState.config.snapPoints}
          keyboardBehavior={sheetState.config.keyboardBehavior}
          androidKeyboardInputMode={sheetState.config.androidKeyboardInputMode}
          onRequestClose={handleRequestClose}
        >
          {sheetState.config.children}
        </AppBottomSheet>
      ) : null}
    </TopLevelSheetContext.Provider>
  );
};

export const useTopLevelSheet = () => {
  const context = useContext(TopLevelSheetContext);

  if (!context) {
    throw new Error(
      "useTopLevelSheet must be used within TopLevelSheetProvider",
    );
  }

  return context;
};

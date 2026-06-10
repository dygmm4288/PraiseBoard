import AppBottomSheet from "@/shared/components/bottom-sheet/bottom-sheet";
import { BottomSheetProps } from "@gorhom/bottom-sheet";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type TopLevelSheetConfig = {
  children: ReactNode;
  snapPoints: (string | number)[];
  initialIndex?: number;
  keyboardBehavior?: BottomSheetProps["keyboardBehavior"];
  onClose?: () => void;
};

type TopLevelSheetContextValue = {
  presentTopLevelSheet: (config: TopLevelSheetConfig) => void;
  dismissTopLevelSheet: () => void;
};

type TopLevelSheetState = {
  config: TopLevelSheetConfig | null;
  index: number;
};

const TopLevelSheetContext = createContext<TopLevelSheetContextValue | null>(
  null,
);

export const TopLevelSheetProvider = ({ children }: PropsWithChildren) => {
  const [sheetState, setSheetState] = useState<TopLevelSheetState>({
    config: null,
    index: -1,
  });

  const presentTopLevelSheet = useCallback((config: TopLevelSheetConfig) => {
    setSheetState((current) => ({
      config,
      index: current.config ? current.index : (config.initialIndex ?? 0),
    }));
  }, []);

  const dismissTopLevelSheet = useCallback(() => {
    setSheetState((current) =>
      current.config ? { ...current, index: -1 } : current,
    );
  }, []);

  const handleClose = useCallback(() => {
    setSheetState((current) => {
      current.config?.onClose?.();

      return {
        config: null,
        index: -1,
      };
    });
  }, []);

  const handleChangeIndex = useCallback(
    (index: number) => {
      if (index === -1) {
        handleClose();
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
    [handleClose],
  );

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

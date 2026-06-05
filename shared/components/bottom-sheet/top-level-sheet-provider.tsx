import AppBottomSheet from "@/shared/components/bottom-sheet/bottom-sheet";
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
  snapPoints: Array<string | number>;
  onClose?: () => void;
};

type TopLevelSheetContextValue = {
  presentTopLevelSheet: (config: TopLevelSheetConfig) => void;
  dismissTopLevelSheet: () => void;
};

const TopLevelSheetContext = createContext<TopLevelSheetContextValue | null>(
  null,
);

export const TopLevelSheetProvider = ({ children }: PropsWithChildren) => {
  const [sheetConfig, setSheetConfig] = useState<TopLevelSheetConfig | null>(
    null,
  );

  const presentTopLevelSheet = useCallback((config: TopLevelSheetConfig) => {
    setSheetConfig(config);
  }, []);

  const dismissTopLevelSheet = useCallback(() => {
    setSheetConfig(null);
  }, []);

  const handleClose = useCallback(() => {
    setSheetConfig((current) => {
      current?.onClose?.();
      return null;
    });
  }, []);

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
      {sheetConfig ? (
        <AppBottomSheet
          state="peek"
          onChangeState={(state) => {
            if (state === "hidden") handleClose();
          }}
          snapPoints={sheetConfig.snapPoints}
        >
          {sheetConfig.children}
        </AppBottomSheet>
      ) : null}
    </TopLevelSheetContext.Provider>
  );
};

export const useTopLevelSheet = () => {
  const context = useContext(TopLevelSheetContext);

  if (!context) {
    throw new Error("useTopLevelSheet must be used within TopLevelSheetProvider");
  }

  return context;
};

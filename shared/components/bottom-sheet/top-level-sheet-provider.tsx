import AppBottomSheet from "@/shared/components/bottom-sheet/bottom-sheet";
import {
  clearTopLevelSheetState,
  DismissTopLevelSheetOptions,
  getClosedSheetState,
  presentTopLevelSheetState,
  requestDismissTopLevelSheetState,
  TopLevelSheetConfig,
  TopLevelSheetState,
  updateTopLevelSheetIndexState,
} from "@/shared/components/bottom-sheet/top-level-sheet-state";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { KeyboardController } from "react-native-keyboard-controller";

type TopLevelSheetContextValue = {
  presentTopLevelSheet: (config: TopLevelSheetConfig) => void;
  dismissTopLevelSheet: (options?: DismissTopLevelSheetOptions) => void;
};

const TopLevelSheetContext = createContext<TopLevelSheetContextValue | null>(
  null,
);

export const TopLevelSheetProvider = ({ children }: PropsWithChildren) => {
  const [sheetState, setSheetState] =
    useState<TopLevelSheetState>(getClosedSheetState);

  const presentTopLevelSheet = useCallback((config: TopLevelSheetConfig) => {
    setSheetState((current) => presentTopLevelSheetState(current, config));
  }, []);

  const dismissTopLevelSheet = useCallback(
    (_options?: DismissTopLevelSheetOptions) => {
      void KeyboardController.dismiss();
      setSheetState((current) => requestDismissTopLevelSheetState(current));
    },
    [],
  );

  const clearTopLevelSheet = useCallback((runOnClose: boolean) => {
    setSheetState((current) => clearTopLevelSheetState(current, runOnClose));
  }, []);

  const handleChangeIndex = useCallback(
    (index: number) => {
      if (index === -1) {
        clearTopLevelSheet(true);
        return;
      }

      setSheetState((current) => updateTopLevelSheetIndexState(current, index));
    },
    [clearTopLevelSheet],
  );

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
          key={sheetState.presentationId}
          index={sheetState.index}
          onChangeIndex={handleChangeIndex}
          snapPoints={sheetState.config.snapPoints}
          keyboardBehavior={sheetState.config.keyboardBehavior}
          keyboardBlurBehavior={sheetState.config.keyboardBlurBehavior}
          enableBlurKeyboardOnGesture={
            sheetState.config.enableBlurKeyboardOnGesture
          }
          androidKeyboardInputMode={sheetState.config.androidKeyboardInputMode}
          enableContentPanningGesture={
            sheetState.config.enableContentPanningGesture
          }
          onRequestClose={dismissTopLevelSheet}
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

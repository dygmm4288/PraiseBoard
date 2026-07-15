import AppBottomSheet, {
  AppBottomSheetRef,
} from "@/shared/components/bottom-sheet/bottom-sheet";
import {
  getDismissalResult,
  getSafeInitialIndex,
  hasSnapPoints,
} from "@/shared/components/bottom-sheet/top-level-sheet-state";
import type {
  DismissTopLevelSheetOptions,
  TopLevelSheetConfig,
  TopLevelSheetPresentation,
} from "@/shared/components/bottom-sheet/top-level-sheet-state";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  const [config, setConfig] = useState<TopLevelSheetConfig | null>(null);
  const modalRef = useRef<AppBottomSheetRef>(null);
  const nextPresentationIdRef = useRef(0);
  const activePresentationRef = useRef<TopLevelSheetPresentation | null>(null);
  const pendingPresentationRef = useRef<TopLevelSheetPresentation | null>(null);
  const dismissRunOnCloseRef = useRef(new Map<number, boolean>());
  const isDismissingRef = useRef(false);

  const dismissActivePresentation = useCallback(
    (runOnClose: boolean, overwriteRunOnClose: boolean) => {
      const activePresentation = activePresentationRef.current;

      if (!activePresentation) {
        return;
      }

      if (
        overwriteRunOnClose ||
        !dismissRunOnCloseRef.current.has(activePresentation.id)
      ) {
        dismissRunOnCloseRef.current.set(activePresentation.id, runOnClose);
      }

      isDismissingRef.current = true;
      void KeyboardController.dismiss();
      modalRef.current?.dismiss();
    },
    [],
  );

  const presentTopLevelSheet = useCallback(
    (config: TopLevelSheetConfig) => {
      if (!hasSnapPoints(config)) {
        if (__DEV__) {
          console.warn(
            "presentTopLevelSheet requires at least one snap point; the request was ignored.",
          );
        }
        return;
      }

      const nextPresentation: TopLevelSheetPresentation = {
        id: nextPresentationIdRef.current + 1,
        config: { ...config },
      };
      nextPresentationIdRef.current = nextPresentation.id;

      if (activePresentationRef.current) {
        // A replacement waits for the active modal's onDismiss; only the latest request is retained.
        pendingPresentationRef.current = nextPresentation;
        dismissActivePresentation(true, false);
        return;
      }

      activePresentationRef.current = nextPresentation;
      setConfig(nextPresentation.config);
    },
    [dismissActivePresentation],
  );

  const dismissTopLevelSheet = useCallback(
    (options?: DismissTopLevelSheetOptions) => {
      pendingPresentationRef.current = null;
      dismissActivePresentation(options?.runOnClose ?? true, true);
    },
    [dismissActivePresentation],
  );

  useEffect(() => {
    if (!config || activePresentationRef.current?.config !== config) {
      return;
    }

    modalRef.current?.present();
  }, [config]);

  const handleChange = useCallback((index: number) => {
    if (index >= 0 && isDismissingRef.current) {
      modalRef.current?.dismiss();
    }
  }, []);

  const handleDismiss = useCallback((dismissedPresentationId: number) => {
    const dismissalResult = getDismissalResult(
      activePresentationRef.current,
      pendingPresentationRef.current,
      dismissedPresentationId,
    );

    if (!dismissalResult) {
      return;
    }

    const runOnClose =
      dismissRunOnCloseRef.current.get(dismissedPresentationId) ?? true;
    dismissRunOnCloseRef.current.delete(dismissedPresentationId);

    pendingPresentationRef.current = null;
    activePresentationRef.current = dismissalResult.nextPresentation;
    isDismissingRef.current = false;
    setConfig(dismissalResult.nextPresentation?.config ?? null);

    if (runOnClose) {
      dismissalResult.dismissedPresentation.config.onClose?.();
    }
  }, []);

  const value = useMemo(
    () => ({
      presentTopLevelSheet,
      dismissTopLevelSheet,
    }),
    [dismissTopLevelSheet, presentTopLevelSheet],
  );
  const activePresentation = activePresentationRef.current;

  return (
    <BottomSheetModalProvider>
      <TopLevelSheetContext.Provider value={value}>
        {children}
        {config && activePresentation ? (
          <AppBottomSheet
            key={activePresentation.id}
            ref={modalRef}
            initialIndex={getSafeInitialIndex(config)}
            onChange={handleChange}
            onDismiss={() => handleDismiss(activePresentation.id)}
            snapPoints={config.snapPoints}
            keyboardBehavior={config.keyboardBehavior}
            keyboardBlurBehavior={config.keyboardBlurBehavior}
            enableBlurKeyboardOnGesture={config.enableBlurKeyboardOnGesture}
            androidKeyboardInputMode={config.androidKeyboardInputMode}
            enableContentPanningGesture={config.enableContentPanningGesture}
            onRequestClose={dismissTopLevelSheet}
          >
            {config.children}
          </AppBottomSheet>
        ) : null}
      </TopLevelSheetContext.Provider>
    </BottomSheetModalProvider>
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

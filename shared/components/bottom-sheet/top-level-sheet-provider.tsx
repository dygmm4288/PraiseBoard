import AppBottomSheet, {
  AppBottomSheetRef,
} from "@/shared/components/bottom-sheet/bottom-sheet";
import {
  getDismissalResult,
  getSafeInitialIndex,
  hasSheetKey,
  hasSnapPoints,
} from "@/shared/components/bottom-sheet/top-level-sheet-state";
import type {
  TopLevelSheetConfig,
  TopLevelSheetPresentation,
} from "@/shared/components/bottom-sheet/top-level-sheet-state";
import { toast } from "@/shared/toasts/toast";
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
import { usePathname } from "expo-router";
import { KeyboardController } from "react-native-keyboard-controller";

type TopLevelSheetContextValue = {
  presentTopLevelSheet: (config: TopLevelSheetConfig) => boolean;
};

const TopLevelSheetContext = createContext<TopLevelSheetContextValue | null>(
  null,
);

export const TopLevelSheetProvider = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const [config, setConfig] = useState<TopLevelSheetConfig | null>(null);
  const modalRef = useRef<AppBottomSheetRef>(null);
  const nextPresentationIdRef = useRef(0);
  const activePresentationRef = useRef<TopLevelSheetPresentation | null>(null);
  const pendingPresentationRef = useRef<TopLevelSheetPresentation | null>(null);
  const isDismissingRef = useRef(false);
  const previousPathnameRef = useRef(pathname);

  const dismissActivePresentation = useCallback(() => {
    if (!activePresentationRef.current || isDismissingRef.current) return;

    isDismissingRef.current = true;
    toast.hideToast();
    void KeyboardController.dismiss();
    modalRef.current?.dismiss();
  }, []);

  const presentTopLevelSheet = useCallback(
    (config: TopLevelSheetConfig) => {
      if (!hasSnapPoints(config)) {
        if (__DEV__) {
          console.warn(
            "presentTopLevelSheet requires at least one snap point; the request was ignored.",
          );
        }
        return false;
      }

      if (!hasSheetKey(config)) {
        if (__DEV__) {
          console.warn(
            "presentTopLevelSheet requires a non-empty sheetKey; the request was ignored.",
          );
        }
        return false;
      }

      const activePresentation = activePresentationRef.current;
      const pendingPresentation = pendingPresentationRef.current;

      if (
        (!pendingPresentation &&
          activePresentation?.config.sheetKey === config.sheetKey) ||
        pendingPresentation?.config.sheetKey === config.sheetKey
      ) {
        return false;
      }

      const nextPresentation: TopLevelSheetPresentation = {
        id: nextPresentationIdRef.current + 1,
        config: { ...config },
      };
      nextPresentationIdRef.current = nextPresentation.id;

      if (activePresentationRef.current) {
        // A replacement waits for the active modal's onDismiss; only the latest request is retained.
        pendingPresentationRef.current = nextPresentation;
        dismissActivePresentation();
        return true;
      }

      activePresentationRef.current = nextPresentation;
      setConfig(nextPresentation.config);
      return true;
    },
    [dismissActivePresentation],
  );

  const dismissPresentation = useCallback(
    (presentationId: number) => {
      if (
        activePresentationRef.current?.id !== presentationId ||
        isDismissingRef.current
      ) {
        return;
      }

      pendingPresentationRef.current = null;
      dismissActivePresentation();
    },
    [dismissActivePresentation],
  );

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    pendingPresentationRef.current = null;
    dismissActivePresentation();
  }, [dismissActivePresentation, pathname]);

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

    pendingPresentationRef.current = null;
    activePresentationRef.current = dismissalResult.nextPresentation;
    isDismissingRef.current = false;
    setConfig(dismissalResult.nextPresentation?.config ?? null);

    dismissalResult.dismissedPresentation.config.onClose?.();
  }, []);

  const value = useMemo(
    () => ({
      presentTopLevelSheet,
    }),
    [presentTopLevelSheet],
  );
  const activePresentation = activePresentationRef.current;
  const activePresentationId = activePresentation?.id;
  const sheetControls = useMemo(
    () =>
      activePresentationId === undefined
        ? null
        : {
            dismiss: () => dismissPresentation(activePresentationId),
          },
    [activePresentationId, dismissPresentation],
  );

  return (
    <BottomSheetModalProvider>
      <TopLevelSheetContext.Provider value={value}>
        {children}
        {config && activePresentation && sheetControls ? (
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
            onRequestClose={sheetControls.dismiss}
          >
            {config.renderContent(sheetControls)}
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

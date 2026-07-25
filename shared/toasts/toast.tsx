import { View } from "react-native";
import { useEffect } from "react";
import { useKeyboardState } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message";
import { AppText } from "../ui";
import { resolveToastBottomOffset } from "./toast-layout";

type ToastOverrides = Partial<
  Pick<
    Parameters<typeof Toast.show>[0],
    | "autoHide"
    | "visibilityTime"
    | "onShow"
    | "onHide"
    | "onPress"
    | "swipeable"
    | "props"
  >
>;

type ActiveErrorToast = {
  id: number;
  message: string;
  options?: ToastOverrides;
};

let viewport = {
  bottomSafeAreaInset: 0,
  fnbClearance: 0,
  keyboardHeight: 0,
};
let activeErrorToast: ActiveErrorToast | null = null;
let nextToastId = 0;

const getBottomToastOptions = () => ({
  position: "bottom" as const,
  bottomOffset: resolveToastBottomOffset(viewport),
  avoidKeyboard: false,
});

const showActiveErrorToast = (activeToast: ActiveErrorToast) => {
  const { id, message, options } = activeToast;

  Toast.show({
    type: "error",
    text1: message,
    ...options,
    ...getBottomToastOptions(),
    onHide: () => {
      if (activeErrorToast?.id === id) {
        activeErrorToast = null;
      }

      options?.onHide?.();
    },
  });
};

const refreshActiveErrorToast = () => {
  if (activeErrorToast) {
    showActiveErrorToast(activeErrorToast);
  }
};

const updateViewport = (nextViewport: Partial<typeof viewport>) => {
  const next = { ...viewport, ...nextViewport };
  const didChange =
    next.bottomSafeAreaInset !== viewport.bottomSafeAreaInset ||
    next.fnbClearance !== viewport.fnbClearance ||
    next.keyboardHeight !== viewport.keyboardHeight;

  viewport = next;

  if (didChange) {
    refreshActiveErrorToast();
  }
};

export const setFnbToastOffset = (fnbClearance: number) => {
  updateViewport({ fnbClearance });
};

export const toast = {
  success(title: string, message?: string, options?: ToastOverrides) {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      ...getBottomToastOptions(),
      ...options,
    });
  },

  error(message: string, options?: ToastOverrides) {
    const activeToast = {
      id: ++nextToastId,
      message,
      options,
    };

    activeErrorToast = activeToast;
    showActiveErrorToast(activeToast);
  },

  info(message: string, options?: ToastOverrides) {
    Toast.show({
      type: "info",
      text1: message,
      ...getBottomToastOptions(),
      ...options,
    });
  },

  hideToast() {
    activeErrorToast = null;
    Toast.hide();
  },
};

export const ToastKeyboardSync = () => {
  const insets = useSafeAreaInsets();
  const keyboardHeight = useKeyboardState((state) =>
    state.isVisible ? state.height : 0,
  );

  useEffect(() => {
    updateViewport({
      bottomSafeAreaInset: insets.bottom,
      keyboardHeight,
    });
  }, [insets.bottom, keyboardHeight]);

  return null;
};

export const toastConfig = {
  // TODO: success 커스텀
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "pink" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),

  error: ({ text1 }: BaseToastProps) => {
    const message = text1 ?? "";

    return (
      <View
        className="self-center rounded-full bg-[#48464B] px-[15px] py-[6px]"
        style={{
          shadowColor: "rgba(67,66,70,0.22)",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 1,
          shadowRadius: 24,
          elevation: 8,
        }}
      >
        <AppText variant="caption1" weight="semibold" className="text-white">
          {message}
        </AppText>
      </View>
    );
  },
};

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message";
import { COLOR } from "../constants/colors.constant";
import { AppText } from "../ui";

type ToastOverrides = Partial<
  Pick<
    Parameters<typeof Toast.show>[0],
    | "position"
    | "autoHide"
    | "visibilityTime"
    | "topOffset"
    | "bottomOffset"
    | "keyboardOffset"
    | "avoidKeyboard"
    | "onShow"
    | "onHide"
    | "onPress"
    | "swipeable"
    | "props"
  >
>;

export const TOAST_BOTTOM_GAP = 12;
let fnbToastOffset = 0;

const toSafeOffset = (value: number | null | undefined) => {
  if (typeof value !== "number") return 0;
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, value);
};

const getKeyboardHeight = () => {
  try {
    return KeyboardController.isVisible()
      ? toSafeOffset(KeyboardController.state().height)
      : 0;
  } catch {
    return 0;
  }
};

const getBottomToastOptions = (): ToastOverrides => ({
  position: "bottom",
  bottomOffset: Math.max(
    fnbToastOffset,
    getKeyboardHeight() + TOAST_BOTTOM_GAP,
    TOAST_BOTTOM_GAP,
  ),
  avoidKeyboard: false,
});

export const setFnbToastOffset = (offset: number) => {
  fnbToastOffset = toSafeOffset(offset);
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
    Toast.show({
      type: "error",
      text1: message,
      ...getBottomToastOptions(),
      ...options,
    });
  },

  info(message: string, options?: ToastOverrides) {
    Toast.show({
      type: "info",
      text1: message,
      ...getBottomToastOptions(),
      ...options,
    });
  },

  chatError(message: string, options?: ToastOverrides & { refresh?: boolean }) {
    const { refresh: _refresh, ...toastOptions } = options ?? {};

    Toast.show({
      type: "chatError",
      text1: message,
      ...getBottomToastOptions(),
      ...toastOptions,
    });
  },

  hideToast() {
    Toast.hide();
  },
};

export const ToastKeyboardSync = () => {
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
      <View className="self-center flex-row items-center gap-[5px] rounded-[10px] bg-gray-700 px-[14px] py-[8px]">
        <MaterialIcons name="error-outline" size={24} color={COLOR.white} />
        <AppText variant="caption1" weight="regular" className="text-white">
          {message}
        </AppText>
      </View>
    );
  },

  chatError: ({ text1 }: BaseToastProps) => {
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

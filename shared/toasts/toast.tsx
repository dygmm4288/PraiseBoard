import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect } from "react";
import { View } from "react-native";
import {
  KeyboardController,
  KeyboardEvents,
} from "react-native-keyboard-controller";
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

const CHAT_INPUT_TOAST_OFFSET = 88;
let activeChatToastMessage: string | null = null;

const chatInputBottomToastOptions: ToastOverrides = {
  position: "bottom",
  bottomOffset: CHAT_INPUT_TOAST_OFFSET,
  avoidKeyboard: false,
};

const getChatToastOptions = (): ToastOverrides => {
  try {
    const keyboardHeight = KeyboardController.isVisible()
      ? KeyboardController.state().height
      : 0;

    if (keyboardHeight > 0) {
      return {
        position: "bottom",
        bottomOffset: keyboardHeight + CHAT_INPUT_TOAST_OFFSET,
        avoidKeyboard: false,
      };
    }
  } catch {
    return chatInputBottomToastOptions;
  }

  return chatInputBottomToastOptions;
};

export const toast = {
  success(title: string, message?: string, options?: ToastOverrides) {
    Toast.show({
      type: "success",
      text1: title,
      text2: message,
      ...options,
    });
  },

  error(message: string, options?: ToastOverrides) {
    Toast.show({
      type: "error",
      text1: message,
      ...options,
    });
  },

  info(message: string, options?: ToastOverrides) {
    Toast.show({
      type: "info",
      text1: message,
      ...options,
    });
  },

  chatError(message: string, options?: ToastOverrides & { refresh?: boolean }) {
    const {
      refresh: _refresh,
      onShow,
      onHide,
      ...toastOptions
    } = options ?? {};

    Toast.show({
      type: "chatError",
      text1: message,
      ...getChatToastOptions(),
      ...toastOptions,
      onShow: () => {
        activeChatToastMessage = message;
        onShow?.();
      },
      onHide: () => {
        activeChatToastMessage = null;
        onHide?.();
      },
    });
  },

  hideToast() {
    Toast.hide();
  }
};

export const ToastKeyboardSync = () => {
  useEffect(() => {
    const subscription = KeyboardEvents.addListener("keyboardDidHide", () => {
      const message = activeChatToastMessage;

      if (!message) {
        return;
      }

      Toast.show({
        type: "chatError",
        text1: message,
        ...chatInputBottomToastOptions,
        onShow: () => {
          activeChatToastMessage = message;
        },
        onHide: () => {
          activeChatToastMessage = null;
        },
      });
    });

    return () => subscription.remove();
  }, []);

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

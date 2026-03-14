import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
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

const keyboardBottomToastOptions: ToastOverrides = {
  position: "bottom",
  bottomOffset: 12,
  keyboardOffset: 8,
  avoidKeyboard: true,
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

  chatError(message: string) {
    Toast.show({
      type: "error",
      text1: message,
      ...keyboardBottomToastOptions,
    });
  },
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
};

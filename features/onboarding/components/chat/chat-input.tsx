import { COLOR } from "@/shared/constants/colors.constant";
import { useCallback, useMemo } from "react";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import ChatSend from "./chat-send";

type Props = {
  value?: string;
  onChangeText?: (value: string) => void;
  onSend?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  onMaxLengthExceeded?: () => void;
};

const ChatInput = ({
  value = "",
  onChangeText = () => {},
  onSend = () => {},
  placeholder = "",
  disabled = false,
  maxLength,
  onMaxLengthExceeded,
}: Props) => {
  const sendDisabled = useMemo(() => value.length === 0, [value]);
  const handleChangeText = useCallback(
    (nextValue: string) => {
      if (maxLength !== undefined && nextValue.length > maxLength) {
        onMaxLengthExceeded?.();
        onChangeText(nextValue.slice(0, maxLength));
        return;
      }

      onChangeText(nextValue);
    },
    [maxLength, onChangeText, onMaxLengthExceeded],
  );
  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      const key = event.nativeEvent.key;
      const isEditingKey = key === "Backspace" || key === "Enter";

      if (
        maxLength !== undefined &&
        value.length >= maxLength &&
        !isEditingKey
      ) {
        onMaxLengthExceeded?.();
      }
    },
    [maxLength, onMaxLengthExceeded, value.length],
  );

  return (
    <View className="items-center bg-white py-[18px]">
      <View className="h-[42px] w-full flex-row items-center justify-between rounded-[20px] border border-[#EFF1F5] bg-white pl-[15px] pr-[4px]">
        <TextInput
          className="h-full flex-1 pr-[8px] font-pretendard text-[14px] leading-[20px] text-gray-900"
          value={value}
          onChangeText={handleChangeText}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          placeholderTextColor={COLOR.labelGray}
          editable={!disabled}
        />
        <ChatSend onPress={onSend} disabled={disabled || sendDisabled} />
      </View>
    </View>
  );
};

export default ChatInput;

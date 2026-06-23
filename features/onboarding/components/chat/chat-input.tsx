import { COLOR } from "@/shared/constants/colors.constant";
import { useCallback, useEffect, useMemo, useRef } from "react";
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
  autoFocus?: boolean;
  focusTrigger?: unknown;
};

const ChatInput = ({
  value = "",
  onChangeText = () => {},
  onSend = () => {},
  placeholder = "",
  disabled = false,
  maxLength,
  onMaxLengthExceeded,
  autoFocus = false,
  focusTrigger,
}: Props) => {
  const inputRef = useRef<TextInput>(null);
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
  const handleSubmitEditing = useCallback(() => {
    if (disabled || sendDisabled) return;

    onSend();
  }, [disabled, onSend, sendDisabled]);

  useEffect(() => {
    if (!autoFocus || disabled) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [autoFocus, disabled, focusTrigger]);

  return (
    <View className="items-center bg-white">
      <View className="h-[42px] w-full flex-row items-center justify-between rounded-[20px] border border-[#EFF1F5] bg-white pl-[15px] pr-[4px]">
        <TextInput
          ref={inputRef}
          autoFocus={autoFocus}
          className="h-full flex-1 pr-[8px] font-pretendard text-[14px] leading-[20px] text-gray-900"
          value={value}
          onChangeText={handleChangeText}
          onKeyPress={handleKeyPress}
          onSubmitEditing={handleSubmitEditing}
          blurOnSubmit={false}
          returnKeyType="send"
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

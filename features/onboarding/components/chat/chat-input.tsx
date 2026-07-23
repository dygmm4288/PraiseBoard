import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  NativeSyntheticEvent,
  Text,
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
  prefix?: string;
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
  prefix,
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
    <View className="items-center bg-white px-[24px] py-[18px]">
      <View className="h-[41px] w-full flex-row items-center justify-between rounded-[20px] border border-[#EFF1F5] bg-white pl-[15px] pr-[4px]">
        {prefix ? (
          <View className="mr-[6px] h-full justify-center">
            <Text className="font-pretendard text-[14px] leading-[20px] text-black">
              {prefix}
            </Text>
          </View>
        ) : null}
        <View className="relative h-full flex-1 justify-center pr-[8px]">
          {value.length === 0 && placeholder ? (
            <View
              pointerEvents="none"
              className="absolute inset-y-0 left-0 justify-center"
            >
              <Text className="font-pretendard text-[14px] leading-[20px] text-neutral-300">
                {placeholder}
              </Text>
            </View>
          ) : null}
          <TextInput
            ref={inputRef}
            testID="onboarding-chat-input"
            accessibilityLabel="온보딩 답변"
            className="h-full w-full py-0 font-pretendard text-[14px] leading-[20px] text-black"
            style={{ includeFontPadding: false, textAlignVertical: "center" }}
            value={value}
            onChangeText={handleChangeText}
            onKeyPress={handleKeyPress}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="send"
            placeholder=""
            editable={!disabled}
          />
        </View>
        <ChatSend onPress={onSend} disabled={disabled || sendDisabled} />
      </View>
    </View>
  );
};

export default ChatInput;

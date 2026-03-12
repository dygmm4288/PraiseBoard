import { AppInput } from "@/shared/ui";
import { useMemo } from "react";
import { View } from "react-native";
import ChatSend from "./chat-send";

type Props = {
  value?: string;
  onChangeText?: (value: string) => void;
  onSend?: () => void;
  placeholder?: string;
  disabled?: boolean;
};

const ChatInput = ({
  value = "",
  onChangeText = () => {},
  onSend = () => {},
  placeholder = "",
  disabled = false,
}: Props) => {
  const sendDisabled = useMemo(() => value.length === 0, [value]);

  return (
    <View className="flex flex-row items-center gap-[9px] ">
      <AppInput
        className="flex-1"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
      />
      <ChatSend onPress={onSend} disabled={disabled || sendDisabled} />
    </View>
  );
};

export default ChatInput;

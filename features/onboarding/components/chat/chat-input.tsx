import { AppInput } from "@/shared/ui";
import { useMemo } from "react";
import { View } from "react-native";
import ChatSend from "./chat-send";

type Props = {
  value?: string;
  onChangeText?: (value: string) => void;
  onSend?: () => void;
  placeholder?: string;
};

const ChatInput = ({
  value = "",
  onChangeText = () => {},
  onSend = () => {},
  placeholder = "",
}: Props) => {
  const sendDisabled = useMemo(() => value.length === 0, [value]);

  return (
    <View className="flex flex-row items-center gap-[9px] ">
      <AppInput
        className="flex-1"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderClassName="text-gray-400"
      />
      <ChatSend onPress={onSend} disabled={sendDisabled} />
    </View>
  );
};

export default ChatInput;

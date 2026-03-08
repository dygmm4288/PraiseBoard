import ChatSend from "./chat-send";
import { AppInput } from "@/shared/ui";
import { View } from "react-native";

type Props = {
  value?: string;
  onChangeText?: (value: string) => void;
  onSend?: () => void;
};

const ChatInput = ({
  value = "",
  onChangeText = () => {},
  onSend = () => {},
}: Props) => {
  return (
    <View>
      <AppInput value={value} onChangeText={onChangeText} />
      <ChatSend onPress={onSend} />
    </View>
  );
};

export default ChatInput;

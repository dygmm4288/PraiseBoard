import ChatSend from "@/features/onboarding/components/chat/chat-send";
import { AppInput } from "@/shared/components/ui";
import { View } from "react-native";

type Props = {};

const ChatInput = ({}: Props) => {
  return (
    <View>
      <AppInput />
      <ChatSend />
    </View>
  );
};

export default ChatInput;

import { View } from "react-native";
import ChatTypingDot from "./chat-typing-dot";

type Props = {
  totalDots?: number;
};

const ChatTyping = ({ totalDots = 3 }: Props) => {
  return (
    <View className="flex-row items-center gap-[6px] min-h-[24px] max-h-[24px]">
      {Array.from({ length: totalDots }, (_, i) => (
        <ChatTypingDot key={`chat-typing-dot-${i}`} index={i} />
      ))}
    </View>
  );
};

export default ChatTyping;

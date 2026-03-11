import { PropsWithChildren } from "react";
import { View } from "react-native";

const ChatBubbleList = ({ children }: PropsWithChildren) => {
  return <View className="flex flex-col gap-[12px]">{children}</View>;
};

export default ChatBubbleList;

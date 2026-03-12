import { AppText } from "@/shared/ui";
import { Pressable } from "react-native";

type Props = {
  icon: string;
  text: string;
  onPress: () => void;
};
const ChatChip = ({ icon, text, onPress }: Props) => {
  return (
    <Pressable
      className="flex flex-row rounded-[20px] border border-gray-200 bg-white py-sm px-[14px]"
      onPress={onPress}
    >
      <AppText>{icon}</AppText>
      <AppText variant="body2" className="text-gray-700">
        {text}
      </AppText>
    </Pressable>
  );
};

export default ChatChip;

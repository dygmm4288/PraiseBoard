import { AppText } from "@/shared/ui";
import { View } from "react-native";

type Props = {
  icon: string;
  text: string;
};
const ChatChip = ({ icon, text }: Props) => {
  return (
    <View className="flex flex-row rounded-[20px] border border-gray-200 bg-white py-sm px-[14px]">
      <AppText>{icon}</AppText>
      <AppText variant="body2" className="text-gray-700">
        {text}
      </AppText>
    </View>
  );
};

export default ChatChip;

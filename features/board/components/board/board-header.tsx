import { AppText } from "@/shared/ui";
import { View } from "react-native";

type BoardHeaderProps = {
  title: string;
  rewardMemo?: string | null;
};

const BoardHeader = ({ title, rewardMemo }: BoardHeaderProps) => {
  return (
    <View className="items-center gap-[3px]">
      <AppText variant="title3" className="text-center text-gray-500">
        {title}
      </AppText>
      <AppText variant="caption1" className="text-center text-gray-700">
        {rewardMemo}
      </AppText>
    </View>
  );
};

export default BoardHeader;

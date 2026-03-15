import { AppText } from "@/shared/ui";
import { View } from "react-native";

type BoardProgressProps = {
  remainingCount: number;
  progressPercent: number;
};

const BoardProgress = ({
  remainingCount,
  progressPercent,
}: BoardProgressProps) => {
  return (
    <View className="items-center">
      <AppText variant="caption1" className="text-center text-gray-400">
        {`${remainingCount}개 남음 | ${progressPercent}%`}
      </AppText>
    </View>
  );
};

export default BoardProgress;

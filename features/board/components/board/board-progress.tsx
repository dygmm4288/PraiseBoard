import { AppText } from "@/shared/ui";
import { toPadZero } from "@/shared/utils/number";
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
    <View className="items-center rounded-[20px] bg-gray-100 py-[6px] px-[12px] flex-row gap-[8px]">
      <AppText variant="body3" className="text-center text-gray-700">
        {`${remainingCount}개 남음`}
      </AppText>
      <View className="h-[12px] w-[1px] bg-gray-300" />
      <AppText variant="body3" className="text-center text-gray-700">
        {`${toPadZero(progressPercent)}%`}
      </AppText>
    </View>
  );
};

export default BoardProgress;

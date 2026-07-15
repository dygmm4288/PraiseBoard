import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { toPadZero } from "@/shared/utils/number";
import { View } from "react-native";

type BoardProgressProps = {
  remainingCount: number;
  progressPercent: number;
  className?: string;
};

const BoardProgress = ({
  remainingCount,
  progressPercent,
  className
}: BoardProgressProps) => {
  return (
    <View className={cn("items-center rounded-[20px] bg-neutral-100 py-[6px] px-[12px] flex-row gap-[8px]", className)}>
      <AppText variant="body14" className="text-center text-neutral-700">
        {`${remainingCount}개 남음`}
      </AppText>
      <View className="h-[12px] w-[1px] bg-neutral-300" />
      <AppText variant="body14" className="text-center text-neutral-700">
        {`${toPadZero(progressPercent)}%`}
      </AppText>
    </View>
  );
};

export default BoardProgress;

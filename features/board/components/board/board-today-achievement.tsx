import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { View } from "react-native";

type BoardTodayAchievementProps = {
  count: number;
  className?: string;
};

const BoardTodayAchievement = ({
  count,
  className,
}: BoardTodayAchievementProps) => {
  return (
    <View
      className={cn(
        "flex-row items-center justify-between gap-[12px] rounded-[20px] bg-achievement-surface px-[20px] py-[16px]",
        className,
      )}
    >
      <AppText variant="caption2" weight="semibold" className="text-achievement-textStrong">
        오늘의 성취
      </AppText>
      {count === 0 ? (
        <AppText
          variant="caption2"
          className="flex-1 text-right italic text-achievement-textMuted"
        >
          오늘의 성취를 기다리고 있어요
        </AppText>
      ) : (
        <AppText variant="title1" weight="bold" className="text-secondary-50">
          {count}
        </AppText>
      )}
    </View>
  );
};

export default BoardTodayAchievement;

import { useUser } from "@/services/user";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { View } from "react-native";
import { useBoardTodayAchievementQuery } from "../../queries/use-board-today-query";

type BoardTodayProps = {
  className?: string;
};

const BoardToday = ({ className }: BoardTodayProps) => {
  const { profileId } = useUser();
  const { data, isLoading, error } = useBoardTodayAchievementQuery(profileId);

  const count = data?.count ?? 0;

  return (
    <View
      className={cn(
        "flex-row items-center justify-between rounded-[20px] bg-achievement-surface px-[20px] py-[16px] h-[75px]",
        className,
      )}
    >
      <AppText variant="caption2" weight="semibold" className="text-achievement-textStrong">
        오늘의 성취
      </AppText>
      {!profileId ? (
        <AppText variant="caption2" className="text-right text-achievement-textMuted">
          프로필 정보를 확인할 수 없어요
        </AppText>
      ) : isLoading ? (
        <AppText variant="caption2" className="text-right text-achievement-textMuted">
          불러오는 중이에요
        </AppText>
      ) : error ? (
        <AppText variant="caption2" className="text-right text-achievement-textMuted">
          다시 확인해 주세요
        </AppText>
      ) : count === 0 ? (
        <AppText
          variant="caption2"
          className="text-right italic text-achievement-textMuted"
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

export default BoardToday;

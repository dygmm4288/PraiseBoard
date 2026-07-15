import { useUser } from "@/services/user";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { View } from "react-native";
import { useBoardTodayAchievementQuery } from "../../queries/use-board-today-query";
import { BOARD_COLORS } from "../../theme/colors";

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
        "h-[75px] flex-row items-center justify-between rounded-[20px] px-[20px] py-[16px]",
        className,
      )}
      style={{ backgroundColor: BOARD_COLORS.achievement.surface }}
    >
      <AppText
        variant="caption2"
        weight="semibold"
        style={{ color: BOARD_COLORS.achievement.text }}
      >
        오늘의 성취
      </AppText>
      {!profileId ? (
        <AppText
          variant="caption2"
          className="text-right"
          style={{ color: BOARD_COLORS.achievement.textMuted }}
        >
          프로필 정보를 확인할 수 없어요
        </AppText>
      ) : isLoading ? (
        <AppText
          variant="caption2"
          className="text-right"
          style={{ color: BOARD_COLORS.achievement.textMuted }}
        >
          불러오는 중이에요
        </AppText>
      ) : error ? (
        <AppText
          variant="caption2"
          className="text-right"
          style={{ color: BOARD_COLORS.achievement.textMuted }}
        >
          다시 확인해 주세요
        </AppText>
      ) : count === 0 ? (
        <AppText
          variant="caption2"
          className="text-right"
          style={{ color: BOARD_COLORS.achievement.textMuted }}
        >
          오늘의 성취를 기다리고 있어요
        </AppText>
      ) : (
        <AppText
          variant="title1"
          weight="bold"
          style={{ color: BOARD_COLORS.achievement.text }}
        >
          {count}
        </AppText>
      )}
    </View>
  );
};

export default BoardToday;

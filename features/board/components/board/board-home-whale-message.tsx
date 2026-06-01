import {
  useHomeWhaleMessageQuery,
  useLatestWhaleMessageLogQuery,
} from "@/services/whale-message";
import { useCurrentProfile, useUser } from "@/services/user";
import { useMemo } from "react";
import { useHomeBoardsQuery } from "../../queries/use-board-query";
import { useBoardTodayAchievementQuery } from "../../queries/use-board-today-query";
import BoardWhaleMessage from "./board-whale-message";

type BoardHomeWhaleMessageProps = {
  className?: string;
};

const getLatestCreatedAt = (
  values: Array<string | null | undefined>,
): string | null => {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;
};

const BoardHomeWhaleMessage = ({ className }: BoardHomeWhaleMessageProps) => {
  const { profileId } = useUser();
  const { nickname, profile } = useCurrentProfile(profileId);
  const { data: boards } = useHomeBoardsQuery(profileId);
  const { data: todayAchievement } = useBoardTodayAchievementQuery(profileId);
  const { data: latestMessageLog } = useLatestWhaleMessageLogQuery(profileId);

  const homeMessageInput = useMemo(() => {
    if (!profileId || !boards || !todayAchievement) return null;

    return {
      profileId,
      boards,
      todayStickerCount: todayAchievement.count,
      nickname,
      lastLoginAt: profile?.last_login_at ?? null,
    };
  }, [
    boards,
    nickname,
    profile?.last_login_at,
    profileId,
    todayAchievement,
  ]);

  const { data: homeMessageResult } =
    useHomeWhaleMessageQuery(homeMessageInput);

  const latestMessageCreatedAt = getLatestCreatedAt([
    latestMessageLog?.createdAt,
    homeMessageResult?.log?.createdAt,
  ]);

  const fallbackProps = useMemo(
    () => ({
      nickname,
      todayStickerCount: todayAchievement?.count ?? 0,
      boards: boards ?? [],
      lastLoginAt: profile?.last_login_at ?? null,
    }),
    [boards, nickname, profile?.last_login_at, todayAchievement?.count],
  );

  return (
    <BoardWhaleMessage
      className={className}
      message={homeMessageResult?.message}
      latestMessageCreatedAt={latestMessageCreatedAt}
      {...fallbackProps}
    />
  );
};

export default BoardHomeWhaleMessage;

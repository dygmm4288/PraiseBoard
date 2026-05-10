import { useCurrentProfile, useUser } from "@/services/user";
import { useMemo } from "react";
import { resolveWhaleMessage } from "../../domain/whale-message-policy";
import { useBoardsQuery } from "../../queries/use-board-query";
import { useBoardTodayAchievementQuery } from "../../queries/use-board-today-query";
import BoardWhaleMessage from "./board-whale-message";

type BoardHomeWhaleMessageProps = {
  className?: string;
};

const BoardHomeWhaleMessage = ({ className }: BoardHomeWhaleMessageProps) => {
  const { profileId } = useUser();
  const { nickname, profile } = useCurrentProfile(profileId);
  const { data: boards } = useBoardsQuery(profileId);
  const { data: todayAchievement } = useBoardTodayAchievementQuery(profileId);

  const message = useMemo(
    () =>
      resolveWhaleMessage({
        nickname,
        todayStickerCount: todayAchievement?.count ?? 0,
        boards: boards ?? [],
        lastLoginAt: profile?.last_login_at ?? null,
      }),
    [boards, nickname, profile?.last_login_at, todayAchievement?.count],
  );

  const latestStickerCollectedAt = useMemo(() => {
    const collectedAtList =
      boards
        ?.map((board) => board.latestStickerCollectedAt)
        .filter((value): value is string => Boolean(value)) ?? [];

    return collectedAtList.sort().at(-1) ?? null;
  }, [boards]);

  return (
    <BoardWhaleMessage
      className={className}
      message={message}
      latestStickerCollectedAt={latestStickerCollectedAt}
    />
  );
};

export default BoardHomeWhaleMessage;

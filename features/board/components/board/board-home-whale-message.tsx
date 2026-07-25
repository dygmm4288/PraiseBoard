import {
  resolveWhaleMessage,
  useRecordHomeWhaleMessage,
  useLatestWhaleMessageLogQuery,
} from "@/services/whale-message";
import { useCurrentProfile, useUser } from "@/services/user";
import { useEffect, useMemo } from "react";
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
  const recordHomeMessage = useRecordHomeWhaleMessage();

  const message = useMemo(
    () =>
      resolveWhaleMessage({
        boards: boards ?? [],
        todayStickerCount: todayAchievement?.count ?? 0,
        nickname,
        lastLoginAt: profile?.last_login_at ?? null,
      }),
    [boards, nickname, profile?.last_login_at, todayAchievement?.count],
  );

  useEffect(() => {
    if (!profileId || !boards || !todayAchievement) return;

    recordHomeMessage.mutate({
      profileId,
      message,
    });
  }, [
    boards,
    message,
    profileId,
    recordHomeMessage.mutate,
    todayAchievement,
  ]);

  const latestMessageCreatedAt = getLatestCreatedAt([
    latestMessageLog?.createdAt,
    recordHomeMessage.data?.log?.createdAt,
  ]);

  return (
    <BoardWhaleMessage
      className={className}
      message={message}
      latestMessageCreatedAt={latestMessageCreatedAt}
    />
  );
};

export default BoardHomeWhaleMessage;

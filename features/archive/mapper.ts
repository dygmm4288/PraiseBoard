import { ArchiveDailyStickerCount, ArchiveDetail } from "./types";

export type ArchiveBoardDetailRow = {
  id: string;
  title: string;
  emoji: string | null;
  reward_memo: string | null;
  target_count: number;
  limit_count: number;
  current_count: number;
  created_at: string | null;
};

export type ArchiveBoardStatsRow = {
  id: string;
  current_streak?: number | null;
  max_streak?: number | null;
  today_sticker_count?: number | null;
  today_success?: boolean | null;
};

export type ArchiveBoardStreakResult = {
  current_streak?: number;
  max_streak?: number;
};

export type ArchiveStickerDailyRow = {
  d: string;
  count: number;
};

export const getArchiveProgressPercent = (
  currentCount: number,
  targetCount: number,
) => {
  if (targetCount <= 0) return 0;
  return Math.min(100, Math.round((currentCount / targetCount) * 100));
};

export const toArchiveDailyStickerCounts = (
  rows: ArchiveStickerDailyRow[],
): ArchiveDailyStickerCount[] =>
  rows.map((row) => ({
    date: row.d,
    count: row.count,
  }));

export const resolveArchiveStreak = (
  stats: ArchiveBoardStatsRow | null,
  streakResult: ArchiveBoardStreakResult | null,
) => ({
  currentStreak: streakResult?.current_streak ?? stats?.current_streak ?? 0,
  maxStreak: streakResult?.max_streak ?? stats?.max_streak ?? 0,
});

export const toArchiveDetail = ({
  boardRow,
  month,
  selectedDate,
  dailyStickerCounts,
  streak,
}: {
  boardRow: ArchiveBoardDetailRow;
  month: string;
  selectedDate: string;
  dailyStickerCounts: ArchiveDailyStickerCount[];
  streak: ArchiveDetail["streak"];
}): ArchiveDetail => {
  const selectedDayCount =
    dailyStickerCounts.find((item) => item.date === selectedDate)?.count ?? 0;

  return {
    board: {
      id: boardRow.id,
      title: boardRow.title,
      emoji: boardRow.emoji ?? "",
      rewardMemo: boardRow.reward_memo,
      targetCount: boardRow.target_count,
      limitCount: boardRow.limit_count,
      currentCount: boardRow.current_count,
      progressPercent: getArchiveProgressPercent(
        boardRow.current_count,
        boardRow.target_count,
      ),
      startedAt: boardRow.created_at,
    },
    calendar: {
      month,
      dailyStickerCounts,
    },
    selectedDay: {
      date: selectedDate,
      stickerCount: selectedDayCount,
      completed: selectedDayCount >= boardRow.limit_count,
    },
    streak,
    progressGrid: {
      totalCount: boardRow.target_count,
      completedCount: boardRow.current_count,
    },
  };
};

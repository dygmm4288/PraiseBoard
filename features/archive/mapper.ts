import { getBoardProgress } from "@/features/board/utils/board-progress";
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
  completed_at: string | null;
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

export type ArchiveBestAchievementRow = ArchiveStickerDailyRow;

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
  bestAchievementRow,
  streak,
}: {
  boardRow: ArchiveBoardDetailRow;
  month: string;
  selectedDate: string;
  dailyStickerCounts: ArchiveDailyStickerCount[];
  bestAchievementRow: ArchiveBestAchievementRow | null;
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
      progressPercent: getBoardProgress(
        boardRow.target_count,
        boardRow.current_count,
      ).progressPercent,
      startedAt: boardRow.created_at,
      completed: boardRow.target_count <= boardRow.current_count,
      completedAt: boardRow.completed_at,
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
    bestAchievementDay: bestAchievementRow
      ? {
          date: bestAchievementRow.d,
          count: bestAchievementRow.count,
        }
      : null,
    streak,
    progressGrid: {
      totalCount: boardRow.target_count,
      completedCount: boardRow.current_count,
    },
  };
};

import { supabase } from "@/shared/lib/supabase";
import {
  ArchiveDailyStickerCount,
  ArchiveDetail,
  ArchiveDetailRequest,
  IArchiveRepository,
} from "./types";

const BOARD_DETAIL_FIELDS =
  "id, title, emoji, reward_memo, target_count, limit_count, current_count, created_at";

type BoardStatsRow = {
  id: string;
  current_streak?: number | null;
  max_streak?: number | null;
  today_sticker_count?: number | null;
  today_success?: boolean | null;
};

type BoardStreakResult = {
  current_streak?: number;
  max_streak?: number;
};

const getMonthRange = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);

  if (!year || !monthIndex) {
    throw new Error("month must be formatted as YYYY-MM");
  }

  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const getSelectedDate = (month: string) => {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  if (month === currentMonth) {
    return now.toISOString().slice(0, 10);
  }

  return `${month}-01`;
};

const getProgressPercent = (currentCount: number, targetCount: number) => {
  if (targetCount <= 0) return 0;
  return Math.min(100, Math.round((currentCount / targetCount) * 100));
};

const resolveStreak = (
  stats: BoardStatsRow | null,
  streakResult: BoardStreakResult | null,
) => ({
  currentStreak:
    streakResult?.current_streak ?? stats?.current_streak ?? 0,
  maxStreak: streakResult?.max_streak ?? stats?.max_streak ?? 0,
});

export const archiveRepository: IArchiveRepository = {
  async getDetail({
    boardId,
    month,
  }: ArchiveDetailRequest): Promise<ArchiveDetail> {
    const { startDate, endDate } = getMonthRange(month);
    const selectedDate = getSelectedDate(month);

    const [
      { data: boardRow, error: boardError },
      { data: statsRow, error: statsError },
      { data: dailyRows, error: dailyError },
      { data: streakResult, error: streakError },
    ] = await Promise.all([
      supabase.from("boards").select(BOARD_DETAIL_FIELDS).eq("id", boardId).single(),
      supabase.rpc("get_boards_with_stats").eq("id", boardId).maybeSingle(),
      supabase
        .from("sticker_daily")
        .select("d, count")
        .eq("board_id", boardId)
        .gte("d", startDate)
        .lt("d", endDate)
        .order("d", { ascending: true }),
      supabase.rpc("get_board_streak", { p_board_id: boardId }),
    ]);

    if (boardError) throw boardError;
    if (statsError) throw statsError;
    if (dailyError) throw dailyError;
    if (streakError) throw streakError;

    const dailyStickerCounts: ArchiveDailyStickerCount[] = (dailyRows ?? []).map(
      (row) => ({
        date: row.d,
        count: row.count,
      }),
    );
    const selectedDayCount =
      dailyStickerCounts.find((item) => item.date === selectedDate)?.count ?? 0;
    const stats = statsRow as BoardStatsRow | null;
    const streak = resolveStreak(stats, streakResult as BoardStreakResult | null);

    return {
      board: {
        id: boardRow.id,
        title: boardRow.title,
        emoji: boardRow.emoji,
        rewardMemo: boardRow.reward_memo,
        targetCount: boardRow.target_count,
        limitCount: boardRow.limit_count,
        currentCount: boardRow.current_count,
        progressPercent: getProgressPercent(
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
  },
};

import { boardRepository } from "@/features/board/repository";
import { supabase } from "@/shared/lib/supabase";
import { getMonthRange } from "@/shared/utils/month";
import {
  ArchiveBoardStatsRow,
  ArchiveBoardStreakResult,
  ArchiveStickerDailyRow,
  resolveArchiveStreak,
  toArchiveDailyStickerCounts,
  toArchiveDetail,
} from "./mapper";
import { ArchiveDetail, ArchiveDetailRequest, IArchiveRepository } from "./types";

const BOARD_DETAIL_FIELDS =
  "id, title, emoji, reward_memo, target_count, limit_count, current_count, created_at";

const getSelectedDate = (month: string, todayKey: string) => {
  const currentMonth = todayKey.slice(0, 7);

  if (month === currentMonth) {
    return todayKey;
  }

  return `${month}-01`;
};

export const archiveRepository: IArchiveRepository = {
  async forceSetComplete(boardId) {
    await boardRepository.forceSetComplete(boardId);
  },

  async getDetail({
    boardId,
    month,
    todayKey,
  }: ArchiveDetailRequest): Promise<ArchiveDetail> {
    const { startDate, endDate } = getMonthRange(month);
    const selectedDate = getSelectedDate(month, todayKey);

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

    const dailyStickerCounts = toArchiveDailyStickerCounts(
      (dailyRows ?? []) as ArchiveStickerDailyRow[],
    );
    const stats = statsRow as ArchiveBoardStatsRow | null;
    const streak = resolveArchiveStreak(
      stats,
      streakResult as ArchiveBoardStreakResult | null,
    );

    return toArchiveDetail({
      boardRow,
      month,
      selectedDate,
      dailyStickerCounts,
      streak,
    });
  },
};

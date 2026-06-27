import { supabase } from "@/shared/lib/supabase";
import { getMonthRange } from "@/shared/utils/month";
import {
  StatsBoardRow,
  StatsStickerDailyRow,
  toStatsBoardItems,
  toStatsStickerCounts,
} from "./mapper";
import { IStatsRepository, StatsMonth, StatsMonthRequest } from "./types";

const BOARD_FIELDS = "id, title, emoji, target_count, created_at";

const getCurrentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const getBoardStartMonth = (boards: StatsBoardRow[]) => {
  const firstCreatedAt = boards.find((board) => board.created_at)?.created_at;
  if (!firstCreatedAt) return getCurrentMonthKey();

  const createdDate = new Date(firstCreatedAt);
  if (Number.isNaN(createdDate.getTime())) return getCurrentMonthKey();

  return `${createdDate.getFullYear()}-${String(
    createdDate.getMonth() + 1,
  ).padStart(2, "0")}`;
};

const getMaxStreak = (dates: string[]) => {
  const sortedDates = [...new Set(dates)].sort();
  let maxStreak = 0;
  let currentStreak = 0;
  let previousTime: number | null = null;

  sortedDates.forEach((date) => {
    const time = new Date(`${date}T00:00:00.000Z`).getTime();
    const isConsecutive =
      previousTime !== null && time - previousTime === 24 * 60 * 60 * 1000;

    currentStreak = isConsecutive ? currentStreak + 1 : 1;
    maxStreak = Math.max(maxStreak, currentStreak);
    previousTime = time;
  });

  return maxStreak;
};

export const statsRepository: IStatsRepository = {
  async getMonth({ profileId, month }: StatsMonthRequest): Promise<StatsMonth> {
    const { startDate, endDate } = getMonthRange(month);

    const { data: boardRows, error: boardError } = await supabase
      .from("boards")
      .select(BOARD_FIELDS)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true });

    if (boardError) throw boardError;

    const boards = (boardRows ?? []) as StatsBoardRow[];
    const boardIds = boards.map((board) => board.id);
    const startMonth = getBoardStartMonth(boards);

    if (boardIds.length === 0) {
      return {
        month,
        startMonth,
        stickerCounts: [],
        boardItems: [],
        totalCount: 0,
        maxStreak: 0,
      };
    }

    const { data: dailyRows, error: dailyError } = await supabase
      .from("sticker_daily")
      .select("board_id, d, count")
      .in("board_id", boardIds)
      .gte("d", startDate)
      .lt("d", endDate)
      .order("d", { ascending: true });

    if (dailyError) throw dailyError;

    const rows = (dailyRows ?? []) as StatsStickerDailyRow[];
    const stickerCounts = toStatsStickerCounts(rows);

    return {
      month,
      startMonth,
      stickerCounts,
      boardItems: toStatsBoardItems(boards, rows),
      totalCount: stickerCounts.reduce((total, item) => total + item.count, 0),
      maxStreak: getMaxStreak(stickerCounts.map((item) => item.date)),
    };
  },
};

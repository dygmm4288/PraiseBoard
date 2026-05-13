import { supabase } from "@/shared/lib/supabase";
import {
  IStatsRepository,
  StatBoardItem,
  StatsMonth,
  StatsMonthRequest,
} from "./types";

const BOARD_FIELDS = "id, title, emoji, target_count";

type BoardRow = {
  id: string;
  title: string;
  emoji: string | null;
  target_count: number;
};

type StickerDailyRow = {
  board_id: string;
  d: string;
  count: number;
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

const toBoardItems = (
  boards: BoardRow[],
  dailyRows: StickerDailyRow[],
): StatBoardItem[] => {
  const countByBoard = dailyRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.board_id] = (acc[row.board_id] ?? 0) + row.count;
    return acc;
  }, {});

  return boards.map((board) => ({
    id: board.id,
    emoji: board.emoji ?? "🐋",
    title: board.title,
    currentCount: countByBoard[board.id] ?? 0,
    targetCount: board.target_count,
  }));
};

const toStickerCounts = (dailyRows: StickerDailyRow[]) => {
  const countByDate = dailyRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.d] = (acc[row.d] ?? 0) + row.count;
    return acc;
  }, {});

  return Object.entries(countByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const statsRepository: IStatsRepository = {
  async getMonth({
    profileId,
    month,
  }: StatsMonthRequest): Promise<StatsMonth> {
    const { startDate, endDate } = getMonthRange(month);

    const { data: boardRows, error: boardError } = await supabase
      .from("boards")
      .select(BOARD_FIELDS)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: true });

    if (boardError) throw boardError;

    const boards = (boardRows ?? []) as BoardRow[];
    const boardIds = boards.map((board) => board.id);

    if (boardIds.length === 0) {
      return {
        month,
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

    const rows = (dailyRows ?? []) as StickerDailyRow[];
    const stickerCounts = toStickerCounts(rows);

    return {
      month,
      stickerCounts,
      boardItems: toBoardItems(boards, rows),
      totalCount: stickerCounts.reduce((total, item) => total + item.count, 0),
      maxStreak: getMaxStreak(stickerCounts.map((item) => item.date)),
    };
  },
};

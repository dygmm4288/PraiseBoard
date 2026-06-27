import { StatBoardItem } from "./types";

export type StatsBoardRow = {
  id: string;
  title: string;
  emoji: string | null;
  target_count: number;
  created_at: string | null;
};

export type StatsStickerDailyRow = {
  board_id: string;
  d: string;
  count: number;
};

export const toStatsBoardItems = (
  boards: StatsBoardRow[],
  dailyRows: StatsStickerDailyRow[],
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

export const toStatsStickerCounts = (dailyRows: StatsStickerDailyRow[]) => {
  const countByDate = dailyRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.d] = (acc[row.d] ?? 0) + row.count;
    return acc;
  }, {});

  return Object.entries(countByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

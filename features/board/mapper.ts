import { BoardRecord, BoardStatus } from "./types";

export type BoardRecordRow = {
  id: string;
  title: string;
  emoji?: string | null;
  target_count: number;
  limit_count?: number | null;
  current_count: number;
  today_sticker_count?: number | null;
  latest_sticker_collected_at?: string | null;
  current_streak?: number | null;
  max_streak?: number | null;
  today_success?: boolean | null;
  reward_memo: string | null;
  status: BoardStatus;
  created_at?: string | null;
  completed_at?: string | null;
};

export const toBoardRecord = (row: BoardRecordRow): BoardRecord => ({
  id: row.id,
  createdAt: row.created_at ?? null,
  completedAt: row.status === "completed" ? (row.completed_at ?? null) : null,
  title: row.title,
  emoji: row.emoji ?? "🐋",
  targetCount: row.target_count,
  limitCount: row.limit_count ?? 10,
  currentCount: row.current_count,
  todayStickerCount: row.today_sticker_count ?? 0,
  latestStickerCollectedAt: row.latest_sticker_collected_at || null,
  currentStreak: row.current_streak ?? 0,
  maxStreak: row.max_streak ?? 0,
  todaySuccess: row.today_success ?? false,
  rewardMemo: row.reward_memo,
  status: row.status,
});

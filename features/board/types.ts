import { Database } from "@/shared/types/supabase.types";

export type BoardStatus = Database["public"]["Enums"]["board_status"];
export type BoardStickerSource = Database["public"]["Enums"]["sticker_source"];

export class ActiveBoardLimitError extends Error {
  constructor() {
    super("ACTIVE_BOARD_LIMIT_REACHED");
    this.name = "ActiveBoardLimitError";
  }
}

export type Board = {
  id: string;
  title: string;
  emoji: string;
  target_count: number;
  limit_count: number;
};

export type BoardRecord = {
  id: string;
  createdAt: string | null;
  completedAt: string | null;
  title: string;
  emoji: string;
  targetCount: number;
  limitCount: number;
  currentCount: number;
  todayStickerCount: number;
  latestStickerCollectedAt: string | null;
  currentStreak: number;
  maxStreak: number;
  todaySuccess: boolean;
  rewardMemo: string | null;
  status: BoardStatus;
};

export type BoardTodayAchievement = {
  count: number;
};

export type BoardProgress = {
  totalCount: number;
  completedCount: number;
  remainingCount: number;
  progressPercent: number;
};

export type CollectStickerFailureReason =
  | "DAILY_LIMIT_EXCEEDED"
  | "BOARD_NOT_FOUND"
  | "FORBIDDEN"
  | "BOARD_COMPLETED";

export type CollectStickerRpcResult = {
  success: boolean;
  reason?: CollectStickerFailureReason;
  current_count?: number;
  target_count?: number;
  today_count?: number;
  limit_count?: number;
};

export type CollectStickerError = Error & {
  reason?: CollectStickerFailureReason;
  currentCount?: number;
  todayStickerCount?: number;
  limitCount?: number;
};

export type BoardListParams = {
  profileId?: string;
  status?: BoardStatus;
  page?: number;
  limit?: number;
  orderBy?:
    | "created_at"
    | "completed_at"
    | "latest_sticker_collected_at"
    | "home_sort_rank";
  order?: "asc" | "desc";
};

export type BoardListResult = {
  items: BoardRecord[];
  pageInfo: {
    page?: number;
    limit?: number;
    totalCount?: number;
  };
};

import {
  BoardCreatePayload,
  BoardSetupPayload,
  BoardUpdatePayload,
} from "@/features/board/schema";
import { Database } from "@/shared/types/supabase.types";

export type BoardStatus = Database["public"]["Enums"]["board_status"];
export type BoardStickerSource = Database["public"]["Enums"]["sticker_source"];

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

export type BoardCardData = {
  id: string;
  title: string;
  rewardMemo?: string | null;
  totalCount: number;
  completedCount: number;
  todayStickerCount: number;
  latestStickerCollectedAt: string | null;
};

export type BoardTodayAchievement = {
  count: number;
};

export type BoardCardProps = {
  className?: string;
  columns?: number;
};

export type BoardStickerGridProps = {
  totalCount: number;
  completedCount: number;
  className?: string;
  columns?: number;
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
  | "FORBIDDEN";

export type CollectStickerRpcResult = {
  success: boolean;
  reason?: CollectStickerFailureReason;
  current_count?: number;
  limit_count?: number;
};

export type CollectStickerError = Error & {
  reason?: CollectStickerFailureReason;
  currentCount?: number;
  todayStickerCount?: number;
  limitCount?: number;
};

export type IBoardRepository = {
  createBoard: (input: BoardCreatePayload) => Promise<BoardRecord>;
  updateBoard: (input: BoardUpdatePayload) => Promise<BoardRecord>;
  deleteBoard: (boardId: string) => Promise<void>;
  getBoards: (params: BoardListParams) => Promise<BoardListResult | null>;
  getHomeBoards: () => Promise<BoardListResult | null>;
  getTodayAchievement: (profileId: string) => Promise<BoardTodayAchievement>;
  collectSticker: (
    boardId: string,
    source: BoardStickerSource,
  ) => Promise<BoardRecord>;
  forceSetComplete: (boardId: string) => Promise<BoardRecord>;
};

export type IBoardService = {
  createBoard: (payload: BoardCreatePayload) => Promise<BoardRecord>;
  updateBoard: (payload: BoardUpdatePayload) => Promise<BoardRecord>;
  deleteBoard: (boardId: string) => Promise<void>;
  createBoardFromSetup: (
    profileId: string,
    payload: BoardSetupPayload,
  ) => Promise<BoardRecord>;
  getBoards: (params: BoardListParams) => Promise<BoardListResult | null>;
  getHomeBoards: () => Promise<BoardListResult | null>;
  getActiveBoards: () => Promise<BoardListResult | null>;
  getCompletedBoards: () => Promise<BoardListResult | null>;
  getTodayAchievement: (profileId: string) => Promise<BoardTodayAchievement>;
  collectSticker: (
    boardId: string,
    source: BoardStickerSource,
  ) => Promise<BoardRecord>;
  forceSetComplete: (boardId: string) => Promise<BoardRecord>;
};

export type BoardListParams = {
  profileId?: string;
  status?: BoardStatus;
  page?: number;
  limit?: number;
  orderBy?: "created_at" | "latest_sticker_collected_at";
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

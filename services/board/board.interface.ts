import { BoardSetupPayload } from "@/entities/board/board.schema";
import { Database } from "@/shared/types/supabase.types";

export type BoardStatus = Database["public"]["Enums"]["board_status"];
export type BoardStickerSource = Database["public"]["Enums"]["sticker_source"];

export type BoardRecord = {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  todayStickerCount: number;
  latestStickerCollectedAt: string | null;
  currentStreak: number;
  maxStreak: number;
  todaySuccess: boolean;
  rewardMemo: string | null;
  status: BoardStatus;
};

export type CreateBoardInput = {
  profileId: string;
  title: string;
  targetCount: number;
  rewardMemo: string | null;
};

export type IBoardRepository = {
  createBoard: (input: CreateBoardInput) => Promise<BoardRecord>;
  getBoards: () => Promise<BoardRecord[] | null>;
  collectSticker: (
    boardId: string,
    source: BoardStickerSource,
  ) => Promise<BoardRecord>;
};

export type IBoardService = {
  createBoardFromSetup: (
    profileId: string,
    payload: BoardSetupPayload,
  ) => Promise<BoardRecord>;
  getBoards: () => Promise<BoardRecord[] | null>;
  collectSticker: (
    boardId: string,
    source: BoardStickerSource,
  ) => Promise<BoardRecord>;
};

import { BoardSetupPayload } from "@/entities/board/board.schema";
import { Database } from "@/shared/types/supabase.types";

export type BoardStatus = Database["public"]["Enums"]["board_status"];

export type BoardRecord = {
  id: string;
  profileId: string;
  title: string;
  rewardMemo: string | null;
  targetCount: number;
  currentCount: number;
  status: BoardStatus;
};

export type BoardActivitySummary = {
  todayStickerCount: number;
  latestStickerCollectedAt: string | null;
};

export type CreateBoardInput = {
  profileId: string;
  title: string;
  targetCount: number;
  rewardMemo: string | null;
};

export type IBoardRepository = {
  createBoard: (input: CreateBoardInput) => Promise<BoardRecord>;
  getLatestBoard: (profileId: string) => Promise<BoardRecord | null>;
  getBoardActivitySummary: (boardId: string) => Promise<BoardActivitySummary>;
  getBoards: (profileId: string) => Promise<BoardRecord[] | null>;
  collectSticker: (
    boardId: string,
    source: Database["public"]["Enums"]["sticker_source"],
  ) => Promise<BoardRecord>;
  getBoard: (profileId: string, boardId: string) => Promise<BoardRecord>;
};

export type IBoardService = {
  createBoardFromSetup: (
    profileId: string,
    payload: BoardSetupPayload,
  ) => Promise<BoardRecord>;
  getBoards: (profileId: string) => Promise<BoardRecord[] | null>;
  getLatestBoard: (profileId: string) => Promise<BoardRecord | null>;
  getBoardActivitySummary: (boardId: string) => Promise<BoardActivitySummary>;
  collectSticker: (
    boardId: string,
    source: Database["public"]["Enums"]["sticker_source"],
  ) => Promise<BoardRecord>;
};

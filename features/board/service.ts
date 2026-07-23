import {
  BoardCreatePayload,
  BoardSetupPayload,
  BoardUpdatePayload,
} from "@/features/board/schema";
import { boardApi } from "./board.api";
import { BoardListParams, BoardStickerSource } from "./types";

export const board = {
  async createBoard(payload: BoardCreatePayload) {
    return boardApi.createBoard(payload);
  },

  async updateBoard(payload: BoardUpdatePayload) {
    return boardApi.updateBoard(payload);
  },

  async deleteBoard(boardId: string) {
    return boardApi.deleteBoard(boardId);
  },

  async createBoardFromSetup(profileId: string, payload: BoardSetupPayload) {
    return boardApi.createBoard({
      profileId,
      title: payload.boards.title,
      emoji: payload.boards.emoji,
      targetCount: payload.boards.target_count,
      rewardMemo: payload.boards.reward_memo,
      limitCount: payload.boards.limit_count,
    });
  },

  async getBoards(params: BoardListParams) {
    return boardApi.getBoards(params);
  },

  async getHomeBoards() {
    return boardApi.getHomeBoards();
  },

  async getTodayAchievement(profileId: string) {
    return boardApi.getTodayAchievement(profileId);
  },

  async collectSticker(boardId: string, source: BoardStickerSource) {
    return boardApi.collectSticker(boardId, source);
  },

  async forceSetComplete(boardId: string) {
    return boardApi.forceSetComplete(boardId);
  },

  async getActiveBoards() {
    return boardApi.getBoards({
      status: "active",
      orderBy: "created_at",
      order: "desc",
    });
  },

  async getCompletedBoards() {
    return boardApi.getBoards({
      status: "completed",
      orderBy: "completed_at",
      order: "desc",
    });
  },
};

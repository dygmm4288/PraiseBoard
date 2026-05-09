import { BoardSetupPayload } from "@/features/board/schema";
import { boardRepository } from "./repository";
import { IBoardService } from "./types";

export const board: IBoardService = {
  async createBoard(payload) {
    return boardRepository.createBoard(payload);
  },

  async createBoardFromSetup(profileId, payload: BoardSetupPayload) {
    return boardRepository.createBoard({
      profileId,
      title: payload.boards.title,
      emoji: payload.boards.emoji,
      targetCount: payload.boards.target_count,
      rewardMemo: payload.boards.reward_memo,
      limitCount: payload.boards.limit_count,
    });
  },

  async getBoards(params) {
    return boardRepository.getBoards(params);
  },

  async getTodayAchievement(profileId) {
    return boardRepository.getTodayAchievement(profileId);
  },

  async collectSticker(boardId, source) {
    return boardRepository.collectSticker(boardId, source);
  },

  async getActiveBoards() {
    return boardRepository.getBoards({status: 'active'});
    
  },

  async getCompletedBoards() {
    return boardRepository.getBoards({status: 'completed'});
  },
};

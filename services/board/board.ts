import { BoardSetupPayload } from "@/entities/board/board.schema";
import { IBoardService } from "./board.interface";
import { boardRepository } from "./board.repository.impl";

export const board: IBoardService = {
  async createBoardFromSetup(profileId, payload: BoardSetupPayload) {
    return boardRepository.createBoard({
      profileId,
      title: payload.boards.title,
      targetCount: payload.boards.target_count,
      rewardMemo: payload.boards.reward_memo,
    });
  },

  async getBoards(profileId) {
    return boardRepository.getBoards(profileId);
  },

  async getLatestBoard(profileId) {
    return boardRepository.getLatestBoard(profileId);
  },

  async getBoardActivitySummary(boardId) {
    return boardRepository.getBoardActivitySummary(boardId);
  },

  async collectSticker(boardId, source) {
    return boardRepository.collectSticker(boardId, source);
  },
};

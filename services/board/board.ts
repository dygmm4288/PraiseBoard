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

  async getLatestBoard(profileId) {
    return boardRepository.getLatestBoard(profileId);
  },
};

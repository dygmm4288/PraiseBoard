import { archiveRepository } from "./repository";
import { IArchiveService } from "./types";

export const archive: IArchiveService = {
  getDetail(payload) {
    return archiveRepository.getDetail(payload);
  },

  async forceSetComplete(boardId) {
    await archiveRepository.forceSetComplete(boardId);
  },
};

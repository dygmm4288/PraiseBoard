import { archiveApi } from "./archive.api";
import { ArchiveDetailRequest } from "./types";

export const archive = {
  getDetail(payload: ArchiveDetailRequest) {
    return archiveApi.getDetail(payload);
  },

  async forceSetComplete(boardId: string) {
    await archiveApi.forceSetComplete(boardId);
  },
};

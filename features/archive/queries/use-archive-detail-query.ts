import { archive } from "../service";
import { useQuery } from "@tanstack/react-query";
import { archiveKeys } from "./archive.query.key";

export const useArchiveDetailQuery = (
  boardId: string | null,
  month: string,
) => {
  return useQuery({
    queryKey: boardId ? archiveKeys.month(boardId, month) : ["archive", "idle"],
    queryFn: () => {
      if (!boardId) throw new Error("boardId required");
      return archive.getDetail({ boardId, month });
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};

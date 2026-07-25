import { archiveApi } from "../archive.api";
import useTodayKey from "@/shared/hooks/use-today-key";
import { useQuery } from "@tanstack/react-query";
import { archiveKeys } from "./archive.query.key";

export const useArchiveDetailQuery = (
  boardId: string | null,
  month: string,
) => {
  const todayKey = useTodayKey();

  return useQuery({
    queryKey: boardId
      ? archiveKeys.month(boardId, month, todayKey)
      : ["archive", "idle"],
    queryFn: () => {
      if (!boardId) throw new Error("boardId required");
      return archiveApi.getDetail({ boardId, month, todayKey });
    },
    enabled: !!boardId,
    staleTime: 1000 * 60 * 5,
  });
};

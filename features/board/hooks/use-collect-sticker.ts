import { board } from "@/features/board/service";
import { BoardStickerSource, CollectStickerError } from "@/features/board/types";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../queries/board.query.key";

export const useCollectSticker = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      boardId,
      source,
    }: {
      boardId: string;
      source: BoardStickerSource;
    }) => {
      return board.collectSticker(boardId, source);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
    onError: (error: CollectStickerError) => {
      if (error.reason === "DAILY_LIMIT_EXCEEDED") {
        toast.chatError("오늘 받을 수 있는 스티커를 모두 받았어요");
        return;
      }

      toast.chatError("실패했습니다");
    },
  });
};

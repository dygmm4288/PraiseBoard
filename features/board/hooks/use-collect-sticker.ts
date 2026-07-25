import { collectStickerAction } from "@/features/board/actions/collect-sticker";
import {
  BoardStickerSource,
  CollectStickerError,
} from "@/features/board/types";
import { useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { reportError } from "@/shared/lib/report-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  refreshAfterStickerCollected,
  refreshAfterStickerRejected,
} from "../queries/board-cache";

export const useCollectSticker = () => {
  const queryClient = useQueryClient();
  const { profileId } = useUser();

  return useMutation({
    mutationFn: ({
      boardId,
      source,
    }: {
      boardId: string;
      source: BoardStickerSource;
    }) => {
      return collectStickerAction({
        boardId,
        source,
        profileId,
      });
    },
    onSuccess: async (updatedBoard) => {
      await refreshAfterStickerCollected(queryClient, updatedBoard.id);
    },
    onError: async (
      error: CollectStickerError,
      variables: { boardId: string; source: BoardStickerSource },
    ) => {
      if (error.reason === "DAILY_LIMIT_EXCEEDED") {
        await refreshAfterStickerRejected(queryClient, variables.boardId);
        toast.error("오늘 받을 수 있는 스티커를 모두 받았어요");
        return;
      }

      if (error.reason === "BOARD_COMPLETED") {
        toast.error("이미 완료된 습관이에요");
        await refreshAfterStickerRejected(queryClient, variables.boardId);
        return;
      }

      reportError(error, { scope: "board.collect" });
      toast.error("실패했습니다");
    },
  });
};

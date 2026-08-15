import { boardApi } from "@/features/board/board.api";
import { analytics } from "@/services/analytics";
import { toast } from "@/shared/toasts/toast";
import { reportError } from "@/shared/lib/report-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshAfterBoardChanged } from "../queries/board-cache";

type DeleteBoardSnapshot = {
  id: string;
  currentCount: number;
  targetCount: number;
};

export const useDeleteBoard = (board: DeleteBoardSnapshot) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => boardApi.deleteBoard(board.id),
    onSuccess: () => {
      void analytics.board.deleted(board);
      void refreshAfterBoardChanged(queryClient, board.id);
    },
    onError: (error) => {
      void analytics.action.failed("board_delete");
      reportError(error, { scope: "board.delete" });
      toast.error("삭제에 실패했습니다");
    },
  });

  return {
    deleteBoard: mutateAsync,
    cancelDelete: () => analytics.board.deleteCancelled(board.id),
    isDeleting: isPending,
  };
};

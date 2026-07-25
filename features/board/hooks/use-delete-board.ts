import { boardApi } from "@/features/board/board.api";
import { toast } from "@/shared/toasts/toast";
import { reportError } from "@/shared/lib/report-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { refreshAfterBoardChanged } from "../queries/board-cache";

export const useDeleteBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => boardApi.deleteBoard(boardId),
    onSuccess: () => {
      void refreshAfterBoardChanged(queryClient, boardId);
    },
    onError: (error) => {
      reportError(error, { scope: "board.delete" });
      toast.error("삭제에 실패했습니다");
    },
  });

  return {
    deleteBoard: mutateAsync,
    isDeleting: isPending,
  };
};

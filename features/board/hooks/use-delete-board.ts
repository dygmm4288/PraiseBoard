import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import { board } from "@/features/board/service";
import { statsKeys } from "@/features/stats/queries/stats.query.key";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../queries/board.query.key";

export const useDeleteBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => board.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardKeys.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: statsKeys.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: archiveKeys.detail(boardId),
        refetchType: "all",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.chatError("삭제에 실패했습니다");
    },
  });

  return {
    deleteBoard: mutateAsync,
    isDeleting: isPending,
  };
};

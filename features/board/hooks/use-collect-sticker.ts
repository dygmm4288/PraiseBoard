import { board } from "@/features/board/service";
import {
  BoardListResult,
  BoardStickerSource,
  BoardTodayAchievement,
  CollectStickerError,
} from "@/features/board/types";
import { useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../queries/board.query.key";

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
      return board.collectSticker(boardId, source);
    },
    onSuccess: async (updatedBoard) => {
      if (profileId) {
        queryClient.setQueryData<BoardListResult | null>(
          boardKeys.lists(profileId),
          (boardList) => {
            if (!boardList) return boardList;

            return {
              ...boardList,
              items: boardList.items.map((board) =>
                board.id === updatedBoard.id ? updatedBoard : board,
              ),
            };
          },
        );

        queryClient.setQueryData<BoardTodayAchievement>(
          boardKeys.todayAchievement(profileId),
          (achievement) => ({
            count: (achievement?.count ?? 0) + 1,
          }),
        );
      }

      await queryClient.invalidateQueries({
        queryKey: boardKeys.all,
        refetchType: "active",
      });
    },
    onError: (error: CollectStickerError) => {
      if (error.reason === "DAILY_LIMIT_EXCEEDED") {
        toast.chatError("오늘 받을 수 있는 스티커를 모두 받았어요");
        return;
      }

      console.log(error);
      toast.chatError("실패했습니다");
    },
  });
};

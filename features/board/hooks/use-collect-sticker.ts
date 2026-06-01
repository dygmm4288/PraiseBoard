import { board } from "@/features/board/service";
import {
  BoardListResult,
  BoardStickerSource,
  BoardTodayAchievement,
  CollectStickerError,
} from "@/features/board/types";
import { whaleMessageKeys, whaleMessageService } from "@/services/whale-message";
import { useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../queries/board.query.key";

const replaceBoardInList = (
  boardList: BoardListResult | null | undefined,
  updatedBoard: BoardListResult["items"][number],
) => {
  if (!boardList) return boardList;

  return {
    ...boardList,
    items: boardList.items.map((board) =>
      board.id === updatedBoard.id ? updatedBoard : board,
    ),
  };
};

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
        const currentHomeBoardList =
          queryClient.getQueryData<BoardListResult | null>(
            boardKeys.homeLists(profileId),
          );
        const currentBoardList =
          queryClient.getQueryData<BoardListResult | null>(
            boardKeys.lists(profileId),
          );
        const nextHomeBoardList = replaceBoardInList(
          currentHomeBoardList,
          updatedBoard,
        );
        const nextBoardList = replaceBoardInList(
          currentBoardList,
          updatedBoard,
        );
        const nextBoards =
          nextHomeBoardList?.items ??
          nextBoardList?.items ??
          currentHomeBoardList?.items ??
          currentBoardList?.items;

        if (nextHomeBoardList) {
          queryClient.setQueryData<BoardListResult | null>(
            boardKeys.homeLists(profileId),
            nextHomeBoardList,
          );
        }

        if (nextBoardList) {
          queryClient.setQueryData<BoardListResult | null>(
            boardKeys.lists(profileId),
            nextBoardList,
          );
        }

        const currentTodayAchievement =
          queryClient.getQueryData<BoardTodayAchievement>(
            boardKeys.todayAchievement(profileId),
          );
        const nextTodayStickerCount = (currentTodayAchievement?.count ?? 0) + 1;

        queryClient.setQueryData<BoardTodayAchievement>(
          boardKeys.todayAchievement(profileId),
          (achievement) => ({
            count: (achievement?.count ?? 0) + 1,
          }),
        );

        if (nextBoards) {
          await whaleMessageService.onStickerCollected({
            profileId,
            boards: nextBoards,
            todayStickerCount: nextTodayStickerCount,
          });

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: whaleMessageKeys.latest(profileId),
            }),
            queryClient.invalidateQueries({
              queryKey: whaleMessageKeys.all,
              refetchType: "active",
            }),
          ]);
        }
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

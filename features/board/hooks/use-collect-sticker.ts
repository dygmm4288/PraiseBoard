import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import { board } from "@/features/board/service";
import {
  BoardListResult,
  BoardStickerSource,
  BoardTodayAchievement,
  CollectStickerError,
} from "@/features/board/types";
import {
  whaleMessageKeys,
  whaleMessageService,
} from "@/services/whale-message";
import { useUser } from "@/services/user";
import useTodayKey from "@/shared/hooks/use-today-key";
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

const patchBoardInList = (
  boardList: BoardListResult | null | undefined,
  boardId: string,
  patch: Partial<BoardListResult["items"][number]>,
) => {
  if (!boardList) return boardList;

  return {
    ...boardList,
    items: boardList.items.map((board) =>
      board.id === boardId ? { ...board, ...patch } : board,
    ),
  };
};

const isBoardListQueryKey = (queryKey: readonly unknown[]) =>
  queryKey[0] === boardKeys.all[0] &&
  (queryKey[1] === "list" || queryKey[1] === "home-list");

export const useCollectSticker = () => {
  const queryClient = useQueryClient();
  const { profileId } = useUser();
  const todayKey = useTodayKey();

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
        queryClient.setQueriesData<BoardListResult | null>(
          {
            predicate: (query) => isBoardListQueryKey(query.queryKey),
          },
          (boardList) => replaceBoardInList(boardList, updatedBoard),
        );
        const nextHomeBoardList =
          queryClient.getQueryData<BoardListResult | null>(
            boardKeys.homeLists(profileId, todayKey),
          );
        const nextBoardList = queryClient.getQueryData<BoardListResult | null>(
          boardKeys.lists(profileId),
        );
        const nextBoards = nextHomeBoardList?.items ?? nextBoardList?.items;

        const currentTodayAchievement =
          queryClient.getQueryData<BoardTodayAchievement>(
            boardKeys.todayAchievement(profileId, todayKey),
          );
        const nextTodayStickerCount = (currentTodayAchievement?.count ?? 0) + 1;

        queryClient.setQueryData<BoardTodayAchievement>(
          boardKeys.todayAchievement(profileId, todayKey),
          {
            count: nextTodayStickerCount,
          },
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

        await queryClient.invalidateQueries({
          queryKey: boardKeys.todayAchievement(profileId, todayKey),
          refetchType: "active",
        });
      }

      await queryClient.invalidateQueries({
        queryKey: boardKeys.all,
        refetchType: "active",
      });
      await queryClient.invalidateQueries({
        queryKey: archiveKeys.detail(updatedBoard.id),
        refetchType: "active",
      });
    },
    onError: async (
      error: CollectStickerError,
      variables: { boardId: string; source: BoardStickerSource },
    ) => {
      if (error.reason === "DAILY_LIMIT_EXCEEDED") {
        if (profileId) {
          queryClient.setQueriesData<BoardListResult | null>(
            {
              predicate: (query) => isBoardListQueryKey(query.queryKey),
            },
            (boardList) =>
              patchBoardInList(boardList, variables.boardId, {
                todayStickerCount:
                  error.todayStickerCount ?? error.limitCount ?? 0,
                ...(typeof error.limitCount === "number"
                  ? { limitCount: error.limitCount }
                  : {}),
              }),
          );

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: boardKeys.todayAchievement(profileId, todayKey),
              refetchType: "active",
            }),
            queryClient.invalidateQueries({
              queryKey: boardKeys.all,
              refetchType: "active",
            }),
          ]);
        }

        toast.chatError("오늘 받을 수 있는 스티커를 모두 받았어요");
        return;
      }

      console.log(error);
      toast.chatError("실패했습니다");
    },
  });
};

import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import { board } from "@/features/board/service";
import {
  BoardListResult,
  BoardRecord,
  BoardStickerSource,
  BoardTodayAchievement,
  CollectStickerError,
} from "@/features/board/types";
import { statsKeys } from "@/features/stats/queries/stats.query.key";
import {
  whaleMessageKeys,
  whaleMessageService,
} from "@/services/whale-message";
import { useUser } from "@/services/user";
import useTodayKey from "@/shared/hooks/use-today-key";
import { toast } from "@/shared/toasts/toast";
import {
  QueryClient,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { boardKeys } from "../queries/board.query.key";

type BoardListItem = BoardListResult["items"][number];
type BoardListKind = "all" | "home" | "active" | "completed";

const getTime = (dateValue: string | null) => {
  if (!dateValue) return Number.NEGATIVE_INFINITY;

  const time = new Date(dateValue).getTime();

  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
};

const compareDateDesc = (
  aDateValue: string | null,
  bDateValue: string | null,
) => getTime(bDateValue) - getTime(aDateValue);

const getHomeBoardSortRank = (board: BoardRecord) => {
  if (board.status === "completed") return 2;
  if (board.todayStickerCount >= board.limitCount) return 1;

  return 0;
};

const sortBoardListItems = (items: BoardListItem[], kind: BoardListKind) => {
  return [...items].sort((a, b) => {
    if (kind === "home") {
      const rankDiff = getHomeBoardSortRank(a) - getHomeBoardSortRank(b);

      if (rankDiff !== 0) return rankDiff;
    }

    if (kind === "completed") {
      return compareDateDesc(a.completedAt, b.completedAt);
    }

    return compareDateDesc(a.createdAt, b.createdAt);
  });
};

const patchBoardInList = (
  boardList: BoardListResult | null | undefined,
  boardId: string,
  patch: Partial<BoardListItem>,
  kind: BoardListKind,
) => {
  if (!boardList) return boardList;

  const items = boardList.items.map((board) =>
    board.id === boardId ? { ...board, ...patch } : board,
  );

  return {
    ...boardList,
    items: sortBoardListItems(items, kind),
  };
};

const isBoardListQueryKey = (queryKey: readonly unknown[]) =>
  queryKey[0] === boardKeys.all[0] &&
  (queryKey[1] === "list" || queryKey[1] === "home-list");

const getBoardListProfileId = (queryKey: readonly unknown[]) => {
  const profileId = queryKey[2];

  return typeof profileId === "string" ? profileId : null;
};

const isProfileStatsQueryKey = (
  queryKey: readonly unknown[],
  profileId: string,
) =>
  queryKey[0] === statsKeys.all[0] &&
  queryKey[1] === "month" &&
  queryKey[2] === profileId;

const getBoardListKind = (queryKey: readonly unknown[]): BoardListKind | null => {
  if (queryKey[0] !== boardKeys.all[0]) return null;
  if (queryKey[1] === "home-list") return "home";
  if (queryKey[1] !== "list") return null;
  if (queryKey[3] === "active") return "active";
  if (queryKey[3] === "completed") return "completed";

  return "all";
};

const shouldIncludeBoard = (
  kind: BoardListKind,
  board: BoardListItem,
) => {
  if (kind === "active") return board.status === "active";
  if (kind === "completed") return board.status === "completed";

  return true;
};

const upsertBoardInList = (
  boardList: BoardListResult | null | undefined,
  updatedBoard: BoardListItem,
  kind: BoardListKind,
) => {
  if (!boardList) return boardList;

  const exists = boardList.items.some((board) => board.id === updatedBoard.id);
  const shouldInclude = shouldIncludeBoard(kind, updatedBoard);

  if (!shouldInclude) {
    return {
      ...boardList,
      items: boardList.items.filter((board) => board.id !== updatedBoard.id),
      pageInfo: {
        ...boardList.pageInfo,
        totalCount:
          exists && typeof boardList.pageInfo.totalCount === "number"
            ? Math.max(0, boardList.pageInfo.totalCount - 1)
            : boardList.pageInfo.totalCount,
      },
    };
  }

  if (exists) {
    return {
      ...boardList,
      items: sortBoardListItems(
        boardList.items.map((board) =>
          board.id === updatedBoard.id ? updatedBoard : board,
        ),
        kind,
      ),
    };
  }

  return {
    ...boardList,
    items: sortBoardListItems([updatedBoard, ...boardList.items], kind),
    pageInfo: {
      ...boardList.pageInfo,
      totalCount:
        typeof boardList.pageInfo.totalCount === "number"
          ? boardList.pageInfo.totalCount + 1
          : boardList.pageInfo.totalCount,
    },
  };
};

const syncBoardListQueries = (
  queryClient: QueryClient,
  updatedBoard: BoardListResult["items"][number],
) => {
  queryClient
    .getQueryCache()
    .findAll({
      predicate: (query) => isBoardListQueryKey(query.queryKey),
    })
    .forEach((query) => {
      const kind = getBoardListKind(query.queryKey);
      if (!kind) return;

      queryClient.setQueryData<BoardListResult | null>(
        query.queryKey as QueryKey,
        (boardList) => upsertBoardInList(boardList, updatedBoard, kind),
      );
    });
};

const resetStatsQueriesForBoardLists = async (
  queryClient: QueryClient,
  fallbackProfileId: string,
) => {
  const profileIds = new Set<string>([fallbackProfileId]);

  queryClient
    .getQueryCache()
    .findAll({
      predicate: (query) => isBoardListQueryKey(query.queryKey),
    })
    .forEach((query) => {
      const profileId = getBoardListProfileId(query.queryKey);
      if (profileId) profileIds.add(profileId);
    });

  await Promise.all(
    [...profileIds].map((profileId) =>
      queryClient.resetQueries({
        predicate: (query) =>
          isProfileStatsQueryKey(query.queryKey, profileId),
      }),
    ),
  );
};

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
        syncBoardListQueries(queryClient, updatedBoard);
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
        await resetStatsQueriesForBoardLists(queryClient, profileId);
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
          queryClient
            .getQueryCache()
            .findAll({
              predicate: (query) => isBoardListQueryKey(query.queryKey),
            })
            .forEach((query) => {
              const kind = getBoardListKind(query.queryKey);
              if (!kind) return;

              queryClient.setQueryData<BoardListResult | null>(
                query.queryKey as QueryKey,
                (boardList) =>
                  patchBoardInList(
                    boardList,
                    variables.boardId,
                    {
                      todayStickerCount:
                        error.todayStickerCount ?? error.limitCount ?? 0,
                      ...(typeof error.limitCount === "number"
                        ? { limitCount: error.limitCount }
                        : {}),
                    },
                    kind,
                  ),
              );
            });

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

      if (error.reason === "BOARD_COMPLETED") {
        toast.chatError("이미 완료된 습관이에요");
        await queryClient.invalidateQueries({
          queryKey: boardKeys.all,
          refetchType: "active",
        });
        return;
      }

      console.log(error);
      toast.chatError("실패했습니다");
    },
  });
};

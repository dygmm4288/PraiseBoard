import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import { statsKeys } from "@/features/stats/queries/stats.query.key";
import { whaleMessageKeys } from "@/services/whale-message";
import { QueryClient } from "@tanstack/react-query";
import { boardKeys } from "./board.query.key";

const invalidateActive = (queryClient: QueryClient, queryKey: readonly unknown[]) =>
  queryClient.invalidateQueries({
    queryKey,
    refetchType: "active",
  });

export const refreshAfterBoardChanged = (
  queryClient: QueryClient,
  boardId?: string,
) =>
  Promise.all([
    invalidateActive(queryClient, boardKeys.all),
    invalidateActive(queryClient, statsKeys.all),
    invalidateActive(
      queryClient,
      boardId ? archiveKeys.detail(boardId) : archiveKeys.all,
    ),
    invalidateActive(queryClient, whaleMessageKeys.all),
  ]);

export const refreshAfterStickerCollected = (
  queryClient: QueryClient,
  boardId: string,
) =>
  Promise.all([
    invalidateActive(queryClient, boardKeys.all),
    invalidateActive(queryClient, statsKeys.all),
    invalidateActive(queryClient, archiveKeys.detail(boardId)),
    invalidateActive(queryClient, whaleMessageKeys.all),
  ]);

export const refreshAfterStickerRejected = (
  queryClient: QueryClient,
  boardId: string,
) =>
  Promise.all([
    invalidateActive(queryClient, boardKeys.all),
    invalidateActive(queryClient, archiveKeys.detail(boardId)),
  ]);

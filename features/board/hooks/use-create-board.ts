import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import {
  BOARD_CREATE_DEFAULT_VALUES,
  BoardCreateFormValues,
  BoardCreatePayload,
  normalizeBoardCreatePayload,
} from "@/features/board/schema";
import { board } from "@/features/board/service";
import {
  ActiveBoardLimitError,
  BoardListResult,
  BoardRecord,
} from "@/features/board/types";
import { statsKeys } from "@/features/stats/queries/stats.query.key";
import { useUser } from "@/services/user";
import useTodayKey from "@/shared/hooks/use-today-key";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ZodError } from "zod";
import { boardKeys } from "../queries/board.query.key";
import { ACTIVE_BOARD_LIMIT_MESSAGE } from "../domain/policies/board-policy";

const addBoardToList = (
  boardList: BoardListResult | null | undefined,
  createdBoard: BoardRecord,
) => {
  if (!boardList) return boardList;
  if (boardList.items.some((board) => board.id === createdBoard.id)) {
    return boardList;
  }

  return {
    ...boardList,
    items: [createdBoard, ...boardList.items],
    pageInfo: {
      ...boardList.pageInfo,
      totalCount:
        typeof boardList.pageInfo.totalCount === "number"
          ? boardList.pageInfo.totalCount + 1
          : boardList.pageInfo.totalCount,
    },
  };
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  const { profileId } = useUser();
  const todayKey = useTodayKey();

  const [formData, setFormData] = useState<BoardCreateFormValues>(
    BOARD_CREATE_DEFAULT_VALUES,
  );

  const resetBoard = () => {
    setFormData(BOARD_CREATE_DEFAULT_VALUES);
  };

  const changeFormData =
    <K extends keyof BoardCreateFormValues>(key: K) =>
    (value: BoardCreateFormValues[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };

  const { mutateAsync } = useMutation({
    mutationFn: (payload: BoardCreatePayload) => {
      return board.createBoard(payload);
    },
    onSuccess: (createdBoard) => {
      if (profileId) {
        queryClient.setQueryData<BoardListResult | null>(
          boardKeys.activeLists(profileId, todayKey),
          (boardList) => addBoardToList(boardList, createdBoard),
        );
        queryClient.setQueryData<BoardListResult | null>(
          boardKeys.homeLists(profileId, todayKey),
          (boardList) => addBoardToList(boardList, createdBoard),
        );
        queryClient.setQueryData<BoardListResult | null>(
          boardKeys.lists(profileId),
          (boardList) => addBoardToList(boardList, createdBoard),
        );
      }

      resetBoard();

      void Promise.allSettled([
        queryClient.invalidateQueries({
          queryKey: boardKeys.all,
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: statsKeys.all,
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: archiveKeys.all,
          refetchType: "all",
        }),
      ]);
    },
    onError: (error) => {
      if (error instanceof ActiveBoardLimitError) {
        toast.chatError(ACTIVE_BOARD_LIMIT_MESSAGE);
        return;
      }

      console.log(error);
      toast.chatError("실패했습니다");
    },
  });

  const createBoard = () => {
    if (!profileId) return;

    let payload: BoardCreatePayload;

    try {
      payload = normalizeBoardCreatePayload(formData, profileId);
    } catch (error) {
      if (error instanceof ZodError) {
        toast.chatError(error.issues[0]?.message);
        return;
      }

      throw error;
    }

    return mutateAsync(payload);
  };

  return {
    formData,
    changeFormData,
    createBoard,
  };
};

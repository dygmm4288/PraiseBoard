import { boardApi } from "@/features/board/board.api";
import {
  BoardCreateFormValues,
  BoardUpdatePayload,
  normalizeBoardUpdatePayload,
} from "@/features/board/schema";
import { analytics } from "@/services/analytics";
import { toast } from "@/shared/toasts/toast";
import { reportError } from "@/shared/lib/report-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ZodError } from "zod";
import { refreshAfterBoardChanged } from "../queries/board-cache";

export const useUpdateBoard = (
  boardId: string,
  initialValues: BoardCreateFormValues,
) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] =
    useState<BoardCreateFormValues>(initialValues);

  const changeFormData =
    <K extends keyof BoardCreateFormValues>(key: K) =>
    (value: BoardCreateFormValues[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };

  const { mutateAsync } = useMutation({
    mutationFn: (payload: BoardUpdatePayload) => {
      return boardApi.updateBoard(payload);
    },
    onSuccess: () => {
      void analytics.board.updated();
      void refreshAfterBoardChanged(queryClient, boardId);
    },
    onError: (error) => {
      void analytics.action.failed("board_update");
      reportError(error, { scope: "board.update" });
      toast.error("수정에 실패했습니다");
    },
  });

  const updateBoard = () => {
    let payload: BoardUpdatePayload;

    try {
      payload = normalizeBoardUpdatePayload(formData, boardId);
    } catch (error) {
      if (error instanceof ZodError) {
        toast.error(error.issues[0]?.message);
        return;
      }

      throw error;
    }

    return mutateAsync(payload);
  };

  return {
    formData,
    changeFormData,
    updateBoard,
  };
};

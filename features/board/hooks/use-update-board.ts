import { archiveKeys } from "@/features/archive/queries/archive.query.key";
import {
  BoardCreateFormValues,
  BoardUpdatePayload,
  normalizeBoardUpdatePayload,
} from "@/features/board/schema";
import { board } from "@/features/board/service";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ZodError } from "zod";
import { boardKeys } from "../queries/board.query.key";

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
      return board.updateBoard(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
      queryClient.invalidateQueries({ queryKey: archiveKeys.detail(boardId) });
    },
    onError: (error) => {
      console.log(error);
      toast.chatError("수정에 실패했습니다");
    },
  });

  const updateBoard = () => {
    let payload: BoardUpdatePayload;

    try {
      payload = normalizeBoardUpdatePayload(formData, boardId);
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
    updateBoard,
  };
};

import {
  BOARD_CREATE_DEFAULT_VALUES,
  BoardCreateFormValues,
  BoardCreatePayload,
  normalizeBoardCreatePayload,
} from "@/features/board/schema";
import { board } from "@/features/board/service";
import { useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ZodError } from "zod";
import { boardKeys } from "../queries/board.query.key";

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  const { profileId } = useUser();

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
    onSuccess: () => {
      resetBoard();
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
    onError: (error) => {
      // TODO: error handling
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

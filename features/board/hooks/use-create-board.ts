import { BoardCreatePayload } from "@/features/board/schema";
import { board } from "@/features/board/service";
import { useUser } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { boardKeys } from "../queries/board.query.key";

type FormData = Omit<BoardCreatePayload, "profileId">;

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  const { profileId } = useUser();

  const [formData, setFormData] = useState<FormData>({
    emoji: "🐋",
    limitCount: 1,
    rewardMemo: "",
    targetCount: 0,
    title: "",
  });

  const changeFormData =
    <K extends keyof FormData>(key: K) =>
    (value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const { mutate } = useMutation({
    mutationFn: (payload: BoardCreatePayload) => {
      return board.createBoard(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
    onError: (error) => {
      // TODO: error handling
      toast.chatError("실패했습니다");
    },
  });

  const createBoard = () => {
    if (!profileId) return;
    // TODO validation 추가

    mutate({ ...formData, profileId });
  };

  return {
    formData,
    changeFormData,
    createBoard,
  };
};

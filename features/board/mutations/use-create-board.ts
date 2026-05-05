import { BoardSetupPayload } from "@/features/board/schema";
import { board } from "@/features/board/service";
import { toast } from "@/shared/toasts/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardKeys } from "../queries/board.query.key";

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileId,
      payload,
    }: {
      profileId: string;
      payload: BoardSetupPayload;
    }) => {
      return board.createBoardFromSetup(profileId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all });
    },
    onError: (error) => {
      // TODO: error handling
      toast.chatError("실패했습니다");
    },
  });
};

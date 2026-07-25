import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { WhaleMessage } from "../model/whale-message.interface";
import { whaleMessageService } from "../service/whale-message.service";
import { whaleMessageKeys } from "../queries/whale-message.query.key";

type RecordHomeWhaleMessageInput = {
  profileId: string;
  message: WhaleMessage;
};

export const useRecordHomeWhaleMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profileId, message }: RecordHomeWhaleMessageInput) =>
      whaleMessageService.recordInAppMessage(profileId, message),
    onSuccess: ({ log }, { profileId }) => {
      if (log) {
        queryClient.setQueryData(whaleMessageKeys.latest(profileId), log);
      }
    },
  });
};

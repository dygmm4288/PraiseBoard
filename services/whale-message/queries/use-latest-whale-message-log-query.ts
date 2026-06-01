import { useQuery } from "@tanstack/react-query";
import { whaleMessageService } from "../service/whale-message.service";
import { whaleMessageKeys } from "./whale-message.query.key";

export const useLatestWhaleMessageLogQuery = (profileId: string | null) => {
  return useQuery({
    queryKey: profileId
      ? whaleMessageKeys.latest(profileId)
      : [...whaleMessageKeys.all, "latest", "idle"],
    queryFn: () => {
      if (!profileId) throw new Error("profileId required");

      return whaleMessageService.getLatestMessage(profileId);
    },
    enabled: !!profileId,
    staleTime: 1000 * 60,
  });
};

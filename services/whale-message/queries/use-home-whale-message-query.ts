import { useQuery } from "@tanstack/react-query";
import { HomeWhaleMessageInput } from "../model/whale-message.interface";
import { whaleMessageService } from "../service/whale-message.service";
import { whaleMessageKeys } from "./whale-message.query.key";

export const useHomeWhaleMessageQuery = (
  input: HomeWhaleMessageInput | null,
) => {
  return useQuery({
    queryKey: input
      ? whaleMessageKeys.home(input)
      : [...whaleMessageKeys.all, "home", "idle"],
    queryFn: () => {
      if (!input) throw new Error("home whale message input required");

      return whaleMessageService.onHomeEntered(input);
    },
    enabled: !!input,
    staleTime: 1000 * 60,
  });
};

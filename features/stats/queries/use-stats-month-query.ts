import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../stats.api";
import { statsKeys } from "./stats.query.key";

export const useStatsMonthQuery = (profileId: string | null, month: string) => {
  return useQuery({
    queryKey: profileId
      ? statsKeys.month(profileId, month)
      : ["stats", "month", "idle", month],
    queryFn: () => {
      if (!profileId) throw new Error("profileId required");
      return statsApi.getMonth({ profileId, month });
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
  });
};

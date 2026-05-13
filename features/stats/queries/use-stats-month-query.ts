import { useQuery } from "@tanstack/react-query";
import { stats } from "../service";
import { statsKeys } from "./stats.query.key";

export const useStatsMonthQuery = (profileId: string | null, month: string) => {
  return useQuery({
    queryKey: profileId
      ? statsKeys.month(profileId, month)
      : ["stats", "month", "idle", month],
    queryFn: () => {
      if (!profileId) throw new Error("profileId required");
      return stats.getMonth({ profileId, month });
    },
    enabled: !!profileId,
    staleTime: 1000 * 60 * 5,
  });
};

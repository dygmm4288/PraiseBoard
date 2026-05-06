import { board } from "@/features/board/service";
import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "./board.query.key";

export const useBoardTodayAchievementQuery = (profileId: string | null) => {
  return useQuery({
    queryKey: profileId
      ? boardKeys.todayAchievement(profileId)
      : ["board", "today-achievement", "idle"],
    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return board.getTodayAchievement(profileId);
    },
    enabled: !!profileId,
    staleTime: 1000 * 60,
  });
};

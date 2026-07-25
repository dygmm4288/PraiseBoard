import { boardApi } from "@/features/board/board.api";
import useTodayKey from "@/shared/hooks/use-today-key";
import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "./board.query.key";

export const useBoardTodayAchievementQuery = (profileId: string | null) => {
  const todayKey = useTodayKey();

  return useQuery({
    queryKey: profileId
      ? boardKeys.todayAchievement(profileId, todayKey)
      : ["board", "today-achievement", "idle"],
    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return boardApi.getTodayAchievement(profileId);
    },
    enabled: !!profileId,
    staleTime: 1000 * 60,
  });
};

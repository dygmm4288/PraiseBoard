import { boardApi } from "@/features/board/board.api";
import useTodayKey from "@/shared/hooks/use-today-key";
import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "./board.query.key";

export const useBoardsQuery = (profileId: string | null) => {
  return useQuery({
    queryKey: profileId ? boardKeys.lists(profileId) : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return boardApi.getBoards({});
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data?.items;
    },
  });
};

export const useHomeBoardsQuery = (profileId: string | null) => {
  const todayKey = useTodayKey();

  return useQuery({
    queryKey: profileId
      ? boardKeys.homeLists(profileId, todayKey)
      : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return boardApi.getHomeBoards();
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data?.items;
    },
  });
};

export const useActiveBoardQuery = (profileId: string | null) => {
  const todayKey = useTodayKey();

  return useQuery({
    queryKey: profileId
      ? boardKeys.activeLists(profileId, todayKey)
      : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return boardApi.getBoards({
        status: "active",
        orderBy: "created_at",
        order: "desc",
      });
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data;
    },
  });
};

export const useCompletedBoardQuery = (profileId: string | null) => {
  const todayKey = useTodayKey();

  return useQuery({
    queryKey: profileId
      ? boardKeys.completedLists(profileId, todayKey)
      : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return boardApi.getBoards({
        status: "completed",
        orderBy: "completed_at",
        order: "desc",
      });
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data;
    },
  });
};

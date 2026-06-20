import { board } from "@/features/board/service";
import useTodayKey from "@/shared/hooks/use-today-key";
import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "./board.query.key";

export const useBoardsQuery = (profileId: string | null) => {
  return useQuery({
    queryKey: profileId ? boardKeys.lists(profileId) : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return board.getBoards({});
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

      return board.getHomeBoards();
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data?.items;
    },
  });
};

export const useActiveBoardQuery = (profileId: string | null) => {
  return useQuery({
    queryKey: profileId ? boardKeys.activeLists(profileId) : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return board.getActiveBoards();
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data;
    },
  });
};

export const useCompletedBoardQuery = (profileId: string | null) => {
  return useQuery({
    queryKey: profileId
      ? boardKeys.completedLists(profileId)
      : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return board.getCompletedBoards();
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data;
    },
  });
};

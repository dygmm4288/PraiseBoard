import { board } from "@/services/board";
import { useQuery } from "@tanstack/react-query";
import { boardKeys } from "./board.query.key";

export const useBoardsQuery = (profileId: string | null) => {
  return useQuery({
    queryKey: profileId ? boardKeys.lists(profileId) : ["board", "idle"],

    queryFn: async () => {
      if (!profileId) throw new Error("profileId required");

      return board.getBoards();
    },

    enabled: !!profileId,

    staleTime: 1000 * 60 * 5,

    select: (data) => {
      return data;
    },
  });
};

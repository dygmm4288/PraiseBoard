import {
  useActiveBoardQuery,
  useCompletedBoardQuery,
} from "@/features/board/queries/use-board-query";
import { useUser } from "@/services/user";

const useArchive = () => {
  const { profileId } = useUser();
  const { data: activeBoards } = useActiveBoardQuery(profileId);
  const { data: completedBoards } = useCompletedBoardQuery(profileId);

  return {
    activeBoards: activeBoards?.items || [],
    completedBoards: completedBoards?.items || [],
  };
};

export default useArchive;

import { board } from "@/services/board";
import { useUser } from "@/services/user";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { BoardCardData } from "../types/board-card.type";

export interface BoardContextType {
  isLoading: boolean;
  errorMessage: string | null;
  boardData: BoardCardData | null;
}

const BoardContext = createContext<BoardContextType | null>(null);

type BoardProviderProps = PropsWithChildren<{
  value?: BoardContextType;
}>;

const BoardQueryProvider = ({ children }: PropsWithChildren) => {
  const { profileId } = useUser();
  const [boardData, setBoardData] = useState<BoardCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadBoard = async () => {
      if (!profileId) {
        if (!isMounted) return;
        setBoardData(null);
        setErrorMessage("프로필 정보를 확인할 수 없어요.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const latestBoard = await board.getLatestBoard(profileId);

        if (!isMounted) return;

        setBoardData(mapBoardToCardData(latestBoard));
      } catch (error) {
        console.error("보드 조회 중 오류 발생", error);

        if (!isMounted) return;

        setBoardData(null);
        setErrorMessage("보드를 불러오는 중 오류가 발생했어요.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBoard();

    return () => {
      isMounted = false;
    };
  }, [profileId]);

  const value = {
    isLoading,
    errorMessage,
    boardData,
  } satisfies BoardContextType;

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

export const BoardProvider = ({ children, value }: BoardProviderProps) => {
  if (value) {
    return (
      <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
    );
  }

  return <BoardQueryProvider>{children}</BoardQueryProvider>;
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw Error("useBoard must use in BoardProvider");
  return context;
};

const mapBoardToCardData = (
  input: Awaited<ReturnType<typeof board.getLatestBoard>>,
): BoardCardData | null => {
  if (!input) return null;

  return {
    title: input.title,
    rewardMemo: input.rewardMemo,
    totalCount: input.targetCount,
    completedCount: input.currentCount,
  };
};

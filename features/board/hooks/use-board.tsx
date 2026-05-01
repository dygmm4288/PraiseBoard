import { createContext, PropsWithChildren, useContext } from "react";
import { BoardCardData } from "../types/board.type";

export interface BoardContextType {
  isLoading: boolean;
  errorMessage: string | null;
  boardData: BoardCardData | null;
  collectSticker: () => void;
}

const BoardContext = createContext<BoardContextType | null>(null);

type BoardProviderProps = PropsWithChildren<{
  value?: BoardContextType;
}>;

const BoardQueryProvider = ({ children }: PropsWithChildren) => {
  const value = {
    isLoading: false,
    errorMessage: null,
    boardData: null,
    collectSticker: () => {},
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

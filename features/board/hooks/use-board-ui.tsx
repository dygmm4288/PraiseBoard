import { createContext, PropsWithChildren, useContext, useState } from "react";

export type BoardSheetState = "peek" | "half" | "full";

export interface BoardUIContextType {
  boardSheetState: BoardSheetState;
  setBoardSheetState: (state: BoardSheetState) => void;
  isBoardExpanded: boolean;
  titleMode: "header" | "main";
}

const BoardUIContext = createContext<BoardUIContextType | null>(null);

type BoardUIProviderProps = PropsWithChildren<{
  value?: BoardUIContextType;
}>;

export const BoardUIProvider = ({ children, value }: BoardUIProviderProps) => {
  if (value) {
    return (
      <BoardUIContext.Provider value={value}>
        {children}
      </BoardUIContext.Provider>
    );
  }

  const [boardSheetState, setBoardSheetState] = useState<BoardSheetState>("peek");
  const isBoardExpanded = boardSheetState !== "peek";
  const titleMode = "header";

  const resolvedValue = {
    boardSheetState,
    setBoardSheetState,
    isBoardExpanded,
    titleMode,
  } satisfies BoardUIContextType;

  return (
    <BoardUIContext.Provider value={resolvedValue}>
      {children}
    </BoardUIContext.Provider>
  );
};

export const useBoardUI = () => {
  const context = useContext(BoardUIContext);
  if (!context) throw Error("useBoardUI must use in BoardUIProvider");
  return context;
};

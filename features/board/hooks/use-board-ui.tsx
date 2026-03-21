import { createContext, PropsWithChildren, useContext, useState } from "react";

export interface BoardUIContextType {
  isBoardOpen: boolean;
  toggleBoardOpen: () => void;
  titleMode: "header" | "main";
}

const BoardUIContext = createContext<BoardUIContextType | null>(null);

type BoardUIProviderProps = PropsWithChildren<{
  value?: BoardUIContextType;
}>;

export const BoardUIProvider = ({
  children,
  value,
}: BoardUIProviderProps) => {
  if (value) {
    return (
      <BoardUIContext.Provider value={value}>{children}</BoardUIContext.Provider>
    );
  }

  const [isBoardOpen, setBoardOpen] = useState(false);

  const toggleBoardOpen = () => setBoardOpen((prev) => !prev);
  const titleMode = isBoardOpen ? "header" : "main";

  const resolvedValue = {
    isBoardOpen,
    toggleBoardOpen,
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

import AppBottomSheet, {
  SheetState,
} from "@/shared/components/bottom-sheet/bottom-sheet";
import { BoardCreateFormValues } from "@/features/board/schema";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";
import BoardCreate from "./board-create";
import BoardEditSheetContent from "./board-edit-sheet-content";

export type BoardEditSheetInput = {
  id: string;
  title: string;
  emoji: string;
  targetCount: number;
  limitCount: number;
  rewardMemo?: string | null;
  onDeleted?: () => void;
};

type BoardCreateSheetContextValue = {
  openCreateSheet: () => void;
  openEditSheet: (board: BoardEditSheetInput) => void;
  closeCreateSheet: () => void;
};

type BoardSheetContentState =
  | { type: "create" }
  | {
      type: "edit";
      boardId: string;
      initialValues: BoardCreateFormValues;
      onDeleted?: () => void;
    };

const BoardCreateSheetContext =
  createContext<BoardCreateSheetContextValue | null>(null);

export const BoardCreateSheetProvider = ({ children }: PropsWithChildren) => {
  const [createSheetState, setCreateSheetState] =
    useState<SheetState>("hidden");
  const [contentState, setContentState] = useState<BoardSheetContentState>({
    type: "create",
  });

  const openCreateSheet = useCallback(() => {
    setContentState({ type: "create" });
    setCreateSheetState("peek");
  }, []);

  const openEditSheet = useCallback((board: BoardEditSheetInput) => {
    setContentState({
      type: "edit",
      boardId: board.id,
      initialValues: {
        title: board.title,
        emoji: board.emoji,
        targetCount: board.targetCount,
        limitCount: board.limitCount,
        rewardMemo: board.rewardMemo ?? "",
      },
      onDeleted: board.onDeleted,
    });
    setCreateSheetState("peek");
  }, []);

  const closeCreateSheet = useCallback(() => {
    setCreateSheetState("hidden");
  }, []);

  const value = useMemo(
    () => ({
      openCreateSheet,
      openEditSheet,
      closeCreateSheet,
    }),
    [closeCreateSheet, openCreateSheet, openEditSheet],
  );

  return (
    <BoardCreateSheetContext.Provider value={value}>
      {children}
      <AppBottomSheet
        state={createSheetState}
        onChangeState={setCreateSheetState}
        snapPoints={["68%", "80%"]}
      >
        {createSheetState !== "hidden" ? (
          <View className="flex-1 px-[16px] pb-[16px]">
            {contentState.type === "create" ? (
              <BoardCreate
                onClose={closeCreateSheet}
                onCreated={closeCreateSheet}
              />
            ) : (
              <BoardEditSheetContent
                boardId={contentState.boardId}
                initialValues={contentState.initialValues}
                onClose={closeCreateSheet}
                onUpdated={closeCreateSheet}
                onDeleted={contentState.onDeleted}
              />
            )}
          </View>
        ) : null}
      </AppBottomSheet>
    </BoardCreateSheetContext.Provider>
  );
};

export const useBoardCreateSheet = () => {
  const context = useContext(BoardCreateSheetContext);

  if (!context) {
    throw new Error(
      "useBoardCreateSheet must be used within BoardCreateSheetProvider",
    );
  }

  return context;
};

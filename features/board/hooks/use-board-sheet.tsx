import BoardCreate from "@/features/board/components/board-create/board-create";
import BoardEditSheetContent from "@/features/board/components/board-create/board-edit-sheet-content";
import { BoardCreateFormValues } from "@/features/board/schema";
import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { useCallback } from "react";
import { View } from "react-native";

export type BoardEditSheetInput = {
  id: string;
  title: string;
  emoji: string;
  targetCount: number;
  limitCount: number;
  rewardMemo?: string | null;
  onDeleted?: () => void;
};

const BOARD_SHEET_SNAP_POINTS = ["68%", "80%"];

const toInitialValues = (
  board: BoardEditSheetInput,
): BoardCreateFormValues => ({
  title: board.title,
  emoji: board.emoji,
  targetCount: board.targetCount,
  limitCount: board.limitCount,
  rewardMemo: board.rewardMemo ?? "",
});

export const useBoardSheet = () => {
  const { presentTopLevelSheet, dismissTopLevelSheet } = useTopLevelSheet();

  const openCreateSheet = useCallback(() => {
    presentTopLevelSheet({
      snapPoints: BOARD_SHEET_SNAP_POINTS,
      keyboardBehavior: "fillParent",
      children: (
        <View className="flex-1 px-[16px] pb-[16px]">
          <BoardCreate
            onClose={dismissTopLevelSheet}
            onCreated={dismissTopLevelSheet}
          />
        </View>
      ),
    });
  }, [dismissTopLevelSheet, presentTopLevelSheet]);

  const openEditSheet = useCallback(
    (board: BoardEditSheetInput) => {
      presentTopLevelSheet({
        snapPoints: BOARD_SHEET_SNAP_POINTS,
        keyboardBehavior: "fillParent",
        children: (
          <View className="flex-1 px-[16px] pb-[16px]">
            <BoardEditSheetContent
              boardId={board.id}
              initialValues={toInitialValues(board)}
              onClose={dismissTopLevelSheet}
              onUpdated={dismissTopLevelSheet}
              onDeleted={board.onDeleted}
            />
          </View>
        ),
      });
    },
    [dismissTopLevelSheet, presentTopLevelSheet],
  );

  return {
    openCreateSheet,
    openEditSheet,
    closeBoardSheet: dismissTopLevelSheet,
  };
};

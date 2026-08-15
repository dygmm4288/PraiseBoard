import BoardCreate from "@/features/board/components/board-create/board-create";
import BoardEditSheetContent from "@/features/board/components/board-create/board-edit-sheet-content";
import { BoardCreateFormValues } from "@/features/board/schema";
import { analytics } from "@/services/analytics";
import { useUser } from "@/services/user";
import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { toast } from "@/shared/toasts/toast";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback } from "react";
import {
  ACTIVE_BOARD_LIMIT_MESSAGE,
  canCreateBoard,
} from "../domain/policies/board-policy";
import { useActiveBoardQuery } from "../queries/use-board-query";

export type BoardEditSheetInput = {
  id: string;
  title: string;
  emoji: string;
  targetCount: number;
  currentCount: number;
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
  const { profileId } = useUser();
  const { presentTopLevelSheet } = useTopLevelSheet();
  const { data: activeBoards } = useActiveBoardQuery(profileId);
  const activeBoardCount = activeBoards?.items.length ?? 0;

  const openCreateSheet = useCallback(() => {
    if (!canCreateBoard(activeBoardCount)) {
      void analytics.board.activeLimitReached("client");
      return toast.error(ACTIVE_BOARD_LIMIT_MESSAGE);
    }

    presentTopLevelSheet({
      sheetKey: "board-create",
      snapPoints: BOARD_SHEET_SNAP_POINTS,
      keyboardBehavior: "fillParent",
      keyboardBlurBehavior: "restore",
      enableBlurKeyboardOnGesture: true,
      renderContent: ({ dismiss }) => (
        <BottomSheetView className="flex-1 px-[16px] pb-[16px]">
          <BoardCreate onClose={dismiss} onCreated={dismiss} />
        </BottomSheetView>
      ),
    });
  }, [activeBoardCount, presentTopLevelSheet]);

  const openEditSheet = useCallback(
    (board: BoardEditSheetInput) => {
      const wasAccepted = presentTopLevelSheet({
        sheetKey: `board-edit:${board.id}`,
        snapPoints: BOARD_SHEET_SNAP_POINTS,
        keyboardBehavior: "fillParent",
        keyboardBlurBehavior: "restore",
        enableBlurKeyboardOnGesture: true,
        renderContent: ({ dismiss }) => (
          <BottomSheetView className="flex-1 px-[16px] pb-[16px]">
            <BoardEditSheetContent
              boardId={board.id}
              currentCount={board.currentCount}
              initialValues={toInitialValues(board)}
              onClose={dismiss}
              onUpdated={dismiss}
              onDeleted={board.onDeleted}
            />
          </BottomSheetView>
        ),
      });
      if (wasAccepted) {
        void analytics.board.editStarted();
      }
    },
    [presentTopLevelSheet],
  );

  return {
    openCreateSheet,
    openEditSheet,
  };
};

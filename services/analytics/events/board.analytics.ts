import { reportError } from "@/shared/lib/report-error";
import type { AnalyticsEventMap } from "../core/analytics.types";
import { trackEvent } from "../core/track-event";

export type BoardCreatedSource =
  AnalyticsEventMap["board_created"]["source"];
export type StickerSource =
  AnalyticsEventMap["sticker_collected"]["source"];
export type ActiveLimitSource =
  AnalyticsEventMap["active_limit_reached"]["source"];

type CreatedBoard = {
  id: string;
  targetCount: number;
};

type StickerCollectedBoard = CreatedBoard & {
  currentCount: number;
  status: string;
  createdAt: string | null;
  completedAt: string | null;
};

type DeletedBoard = CreatedBoard & {
  currentCount: number;
};

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const calculateProgress = (currentCount: number, targetCount: number) => {
  if (targetCount <= 0) return 0;
  return Math.min(100, Math.round((currentCount / targetCount) * 100));
};

const calculateTotalDaysTaken = (
  createdAt: string | null,
  completedAt: string | null,
) => {
  if (!createdAt || !completedAt) return null;

  const createdTime = new Date(createdAt).getTime();
  const completedTime = new Date(completedAt).getTime();
  if (!Number.isFinite(createdTime) || !Number.isFinite(completedTime)) {
    return null;
  }

  return Math.max(
    1,
    Math.ceil((completedTime - createdTime) / MILLISECONDS_PER_DAY),
  );
};

const trackCompletedBoard = (board: StickerCollectedBoard) => {
  if (board.status !== "completed") return Promise.resolve();

  const totalDaysTaken = calculateTotalDaysTaken(
    board.createdAt,
    board.completedAt,
  );
  if (totalDaysTaken === null) {
    reportError(new Error("Completed board is missing valid timestamps."), {
      scope: "analytics.board_completed",
      severity: "warning",
    });
    return Promise.resolve();
  }

  return trackEvent("board_completed", {
    board_id: board.id,
    total_days_taken: totalDaysTaken,
  });
};

export const boardAnalytics = {
  /** board 생성 API가 성공한 뒤 반환된 board로 기록한다. */
  created(board: CreatedBoard, source: BoardCreatedSource) {
    return trackEvent("board_created", {
      source,
      board_id: board.id,
      target_count: board.targetCount,
      is_first_board: source === "onboarding",
    });
  },

  /** board 수정 API가 성공한 뒤 호출한다. */
  updated(boardId: string) {
    return trackEvent("board_updated", { board_id: boardId });
  },

  /** board 삭제 API가 성공한 뒤 삭제 전 snapshot으로 기록한다. */
  deleted(board: DeletedBoard) {
    return trackEvent("board_deleted", {
      board_id: board.id,
      progress_at_deletion: calculateProgress(
        board.currentCount,
        board.targetCount,
      ),
    });
  },

  /** 사용자가 board 삭제 확인 modal에서 취소했을 때 호출한다. */
  deleteCancelled(boardId: string) {
    return trackEvent("board_delete_cancelled", { board_id: boardId });
  },

  /** sticker 저장 성공 결과로 check와 completion을 함께 판정한다. */
  async stickerCollected(
    board: StickerCollectedBoard,
    source: StickerSource,
  ) {
    await trackEvent("sticker_collected", {
      source,
      board_id: board.id,
      current_progress: calculateProgress(
        board.currentCount,
        board.targetCount,
      ),
      is_first_check: board.currentCount === 1,
    });
    await trackCompletedBoard(board);
  },

  /** 활성 board 제한이 client 정책 또는 server RPC에서 확정됐을 때 호출한다. */
  activeLimitReached(source: ActiveLimitSource) {
    return trackEvent("active_limit_reached", { source });
  },

  /** board 수정 sheet가 정상적으로 presentation 요청된 뒤 호출한다. */
  editStarted() {
    return trackEvent("board_edit_started");
  },
};

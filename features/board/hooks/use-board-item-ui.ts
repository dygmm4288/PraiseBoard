import { BoardRecord } from "@/services/board";
import { toSafeInteger } from "@/shared/utils/number";
import { BoardProgress } from "../types/board.type";

type Props = {
  board: BoardRecord;
};

const DAILY_STICKER_LIMIT = 3;

export const useBoardItemUi = ({ board }: Props) => {
  const isCompleted = board.status === "completed";
  const isTodayDone = board.todaySuccess;
  const canCollectToday =
    !isCompleted && board.todayStickerCount < DAILY_STICKER_LIMIT;
  const boardDisabled = !canCollectToday;
  const { progressPercent } = getBoardProgress(
    board.targetCount,
    board.currentCount,
  );

  return {
    title: board.title,
    isCompleted,
    isTodayDone,
    progressPercent,
    progressColor: isCompleted
      ? "text-primary-700"
      : isTodayDone
        ? "text-gray-300"
        : "text-primary-500",
    rewardText: board.rewardMemo || "보상이 아직 정해지지 않았어요",
    opacity: isCompleted ? 0.6 : isTodayDone ? 0.58 : 1,
    boardDisabled,
  };
};

/**
 *  현재 보드의 달성률 계산 함수
 */
const getBoardProgress = (
  targetCount: number,
  currentCount: number,
): BoardProgress => {
  const safeTotalCount = toSafeInteger(targetCount);
  const safeCompletedCount = Math.min(
    toSafeInteger(currentCount),
    safeTotalCount,
  );
  const remainingCount = Math.max(0, safeTotalCount - safeCompletedCount);
  const progressPercent =
    safeTotalCount === 0
      ? 0
      : Math.round((safeCompletedCount / safeTotalCount) * 100);

  return {
    totalCount: safeTotalCount,
    completedCount: safeCompletedCount,
    remainingCount,
    progressPercent,
  };
};

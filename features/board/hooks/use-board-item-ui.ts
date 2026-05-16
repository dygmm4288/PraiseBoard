import { BoardProgress, BoardRecord } from "@/features/board/types";
import { getCalendarDateDiff } from "@/shared/utils/date";
import { toSafeInteger } from "@/shared/utils/number";

type Props = {
  board: BoardRecord;
};

const DAILY_STICKER_LIMIT = 3;
const MAX_BOARD_D_DAY = 99;

const getBoardDDay = (createdAt: string | null) => {
  if (!createdAt) return "0";

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) return "0";

  const diffDays = getCalendarDateDiff(createdDate, new Date());
  const safeDiffDays = Math.max(0, Math.min(diffDays, MAX_BOARD_D_DAY));

  return diffDays > MAX_BOARD_D_DAY ? `${MAX_BOARD_D_DAY}+` : `${safeDiffDays}`;
};

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
  const boardDDay = getBoardDDay(board.createdAt);

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
    boardDDay,
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

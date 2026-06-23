import { BoardProgress, BoardRecord } from "@/features/board/types";
import { getCalendarDateDiff } from "@/shared/utils/date";
import { toSafeInteger } from "@/shared/utils/number";

type Props = {
  board: BoardRecord;
};

const MAX_BOARD_D_DAY = 99;

const formatShortDate = (dateValue: string | null) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const getBoardDDay = (baseDateValue: string | null) => {
  if (!baseDateValue) return "0";

  const baseDate = new Date(baseDateValue);

  if (Number.isNaN(baseDate.getTime())) return "0";

  const diffDays = getCalendarDateDiff(baseDate, new Date()) + 1;
  const safeDiffDays = Math.max(0, Math.min(diffDays, MAX_BOARD_D_DAY));

  return diffDays > MAX_BOARD_D_DAY ? `${MAX_BOARD_D_DAY}+` : `${safeDiffDays}`;
};

export const useBoardItemUi = ({ board }: Props) => {
  const isCompleted = board.status === "completed";
  const isTodayDone =
    !isCompleted && board.todayStickerCount >= board.limitCount;
  const boardDisabled = isCompleted || isTodayDone;
  const { progressPercent } = getBoardProgress(
    board.targetCount,
    board.currentCount,
  );
  const boardDDay = getBoardDDay(
    isCompleted ? board.completedAt : board.createdAt,
  );
  const startedAtLabel = formatShortDate(board.createdAt);
  const completedAtLabel = formatShortDate(board.completedAt);
  const completedPeriodLabel =
    isCompleted && startedAtLabel && completedAtLabel
      ? `${startedAtLabel} ~ ${completedAtLabel}`
      : null;

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
    opacity: isCompleted ? 0.6 : isTodayDone ? 0.5 : 1,
    boardDisabled,
    boardDDay,
    completedPeriodLabel,
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

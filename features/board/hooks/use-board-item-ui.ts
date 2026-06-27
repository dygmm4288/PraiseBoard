import { BoardRecord } from "@/features/board/types";
import { getBoardProgress } from "@/features/board/utils/board-progress";
import { formatShortDate, getCalendarDateDiff } from "@/shared/utils/date";

type Props = {
  board: BoardRecord;
};

const MAX_BOARD_D_DAY = 99;

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

export type BoardItemUi = ReturnType<typeof useBoardItemUi>;

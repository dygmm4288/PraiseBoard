import { toSafeInteger } from "@/shared/utils/number";
import { BoardProgress } from "../types/board-card.type";


export const getBoardProgress = (
  totalCount: number,
  completedCount: number,
): BoardProgress => {
  const safeTotalCount = toSafeInteger(totalCount);
  const safeCompletedCount = Math.min(
    toSafeInteger(completedCount),
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

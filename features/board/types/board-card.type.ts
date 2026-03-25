export type BoardCardData = {
  id: string;
  title: string;
  rewardMemo?: string | null;
  totalCount: number;
  completedCount: number;
};

export type BoardCardProps = {
  className?: string;
  columns?: number;
};

export type BoardStickerGridProps = {
  totalCount: number;
  completedCount: number;
  className?: string;
  columns?: number;
};

export type BoardProgress = {
  totalCount: number;
  completedCount: number;
  remainingCount: number;
  progressPercent: number;
};

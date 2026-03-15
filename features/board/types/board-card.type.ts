export type BoardCardData = {
  title: string;
  rewardMemo?: string | null;
  totalCount: number;
  completedCount: number;
};

export type BoardCardProps = {
  data: BoardCardData;
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

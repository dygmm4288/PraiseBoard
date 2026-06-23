export type ArchiveDetailRequest = {
  boardId: string;
  month: string;
  todayKey: string;
};

export type ArchiveDailyStickerCount = {
  date: string;
  count: number;
};

export type ArchiveDetail = {
  board: {
    id: string;
    title: string;
    emoji: string;
    rewardMemo: string | null;
    targetCount: number;
    limitCount: number;
    currentCount: number;
    progressPercent: number;
    startedAt: string | null;
  };
  calendar: {
    month: string;
    dailyStickerCounts: ArchiveDailyStickerCount[];
  };
  selectedDay: {
    date: string;
    stickerCount: number;
    completed: boolean;
  };
  streak: {
    currentStreak: number;
    maxStreak: number;
  };
  progressGrid: {
    totalCount: number;
    completedCount: number;
  };
};

export type IArchiveRepository = {
  forceSetComplete: (boardId: string) => Promise<void>;
  getDetail: (payload: ArchiveDetailRequest) => Promise<ArchiveDetail>;
};

export type IArchiveService = {
  getDetail: (payload: ArchiveDetailRequest) => Promise<ArchiveDetail>;
  forceSetComplete: (boardId: string) => Promise<void>;
};

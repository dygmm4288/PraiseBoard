import { CalendarStickerCount } from "@/shared/components";

export type StatBoardItem = {
  id: string;
  emoji: string;
  title: string;
  currentCount: number;
  targetCount: number;
};

export type StatsMonthRequest = {
  profileId: string;
  month: string;
};

export type StatsMonth = {
  month: string;
  startMonth: string;
  stickerCounts: CalendarStickerCount[];
  boardItems: StatBoardItem[];
  totalCount: number;
  maxStreak: number;
};

export type IStatsRepository = {
  getMonth: (payload: StatsMonthRequest) => Promise<StatsMonth>;
};

export type IStatsService = {
  getMonth: (payload: StatsMonthRequest) => Promise<StatsMonth>;
};

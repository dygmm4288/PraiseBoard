import { BoardListParams } from "../types";

export const boardKeys = {
  all: ["board"] as const,
  lists: (profileId: string, params?: BoardListParams) =>
    [...boardKeys.all, "list", profileId, params] as const,
  homeLists: (profileId: string, todayKey: string) =>
    [...boardKeys.all, "home-list", profileId, todayKey] as const,
  activeLists: (
    profileId: string,
    todayKey: string,
    params?: BoardListParams,
  ) => [...boardKeys.all, "list", profileId, "active", todayKey, params] as const,
  completedLists: (
    profileId: string,
    todayKey: string,
    params?: BoardListParams,
  ) =>
    [...boardKeys.all, "list", profileId, "completed", todayKey, params] as const,
  detail: (boardId: string) => [...boardKeys.all, "detail", boardId] as const,
  todayAchievement: (profileId: string, todayKey: string) =>
    [...boardKeys.all, "today-achievement", profileId, todayKey] as const,
};

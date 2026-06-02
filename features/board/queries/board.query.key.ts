import { BoardListParams } from "../types";

export const boardKeys = {
  all: ["board"] as const,
  lists: (profileId: string, params?: BoardListParams) =>
    [...boardKeys.all, "list", profileId, params] as const,
  homeLists: (profileId: string) =>
    [...boardKeys.all, "home-list", profileId] as const,
  activeLists: (profileId: string, params?: BoardListParams) =>
    [...boardKeys.all, "list", profileId, "active", params] as const,
  completedLists: (profileId: string, params?: BoardListParams) =>
    [...boardKeys.all, "list", profileId, "completed", params] as const,
  detail: (boardId: string) => [...boardKeys.all, "detail", boardId] as const,
  todayAchievement: (profileId: string) =>
    [...boardKeys.all, "today-achievement", profileId] as const,
};

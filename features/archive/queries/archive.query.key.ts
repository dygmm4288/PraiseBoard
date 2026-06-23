export const archiveKeys = {
  all: ["archive"] as const,
  detail: (boardId: string) => [...archiveKeys.all, "detail", boardId] as const,
  month: (boardId: string, month: string, todayKey: string) =>
    [...archiveKeys.detail(boardId), "month", month, todayKey] as const,
};

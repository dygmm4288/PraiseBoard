export const boardKeys = {
  all: ["board"] as const,
  lists: (profileId: string) => [...boardKeys.all, "list", profileId] as const,
  detail: (boardId: string) => [...boardKeys.all, "detail", boardId] as const,
};

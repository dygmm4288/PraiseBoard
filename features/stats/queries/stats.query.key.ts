export const statsKeys = {
  all: ["stats"] as const,
  month: (profileId: string, month: string) =>
    [...statsKeys.all, "month", profileId, month] as const,
};

export const whaleMessageKeys = {
  all: ["whale-message"] as const,
  latest: (profileId: string) =>
    [...whaleMessageKeys.all, "latest", profileId] as const,
};

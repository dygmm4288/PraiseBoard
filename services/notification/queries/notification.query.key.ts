export const notificationKeys = {
  all: ["notification"] as const,
  settings: (profileId: string | null) =>
    [...notificationKeys.all, "settings", profileId ?? "idle"] as const,
};

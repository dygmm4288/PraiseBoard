export const userKeys = {
  all: ["user"] as const,
  profiles: () => [...userKeys.all, "profile"] as const,
  profile: (profileId: string) =>
    [...userKeys.profiles(), profileId] as const,
};

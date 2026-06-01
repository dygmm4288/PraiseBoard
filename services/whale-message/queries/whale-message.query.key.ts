import { HomeWhaleMessageInput } from "../model/whale-message.interface";

export const whaleMessageKeys = {
  all: ["whale-message"] as const,
  latest: (profileId: string) =>
    [...whaleMessageKeys.all, "latest", profileId] as const,
  home: (input: HomeWhaleMessageInput) =>
    [
      ...whaleMessageKeys.all,
      "home",
      input.profileId,
      input.nickname ?? null,
      input.todayStickerCount,
      input.lastLoginAt ?? null,
      input.boards ?? [],
    ] as const,
};

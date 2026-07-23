jest.mock("@/infra/storage", () => {
  const values = new Map<string, string>();

  return {
    localStorage: {
      getItem: jest.fn(async (key: string) => values.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        values.set(key, value);
      }),
      removeItem: jest.fn(async (key: string) => {
        values.delete(key);
      }),
    },
  };
});

import { boardApi } from "@/features/board/board.api";
import { ActiveBoardLimitError } from "@/features/board/types";
import { userApi } from "@/services/user/user.api";
import { supabase } from "@/shared/lib/supabase";

describe("local Supabase API contract", () => {
  afterAll(async () => {
    await supabase.auth.signOut();
  });

  it("runs the anonymous user, profile, board, and sticker flow", async () => {
    const authUserId = await userApi.ensureAnonymousSession();
    const authUser = await userApi.getCurrentAuthUser();
    const profile = await userApi.createProfile(authUserId);

    expect(authUser).toEqual({
      authUserId,
      authState: "anonymous",
    });

    const updatedProfile = await userApi.updateProfile(profile.id, {
      nickname: "통합 테스트",
    });
    expect(updatedProfile.nickname).toBe("통합 테스트");

    const board = await boardApi.createBoard({
      profileId: profile.id,
      title: "API 계약",
      emoji: "🐋",
      targetCount: 30,
      rewardMemo: "완료 보상",
      limitCount: 1,
    });

    expect(board).toMatchObject({
      title: "API 계약",
      emoji: "🐋",
      targetCount: 30,
      limitCount: 1,
      currentCount: 0,
      todayStickerCount: 0,
      status: "active",
    });

    const collectedBoard = await boardApi.collectSticker(board.id, "app");
    const achievement = await boardApi.getTodayAchievement(profile.id);

    expect(collectedBoard).toMatchObject({
      id: board.id,
      currentCount: 1,
      todayStickerCount: 1,
      status: "active",
    });
    expect(achievement).toEqual({ count: 1 });

    await expect(boardApi.collectSticker(board.id, "app")).rejects.toMatchObject(
      {
        reason: "DAILY_LIMIT_EXCEEDED",
        todayStickerCount: 1,
        limitCount: 1,
      },
    );

    const completedBoard = await boardApi.forceSetComplete(board.id);
    expect(completedBoard.status).toBe("completed");
    await expect(boardApi.collectSticker(board.id, "app")).rejects.toMatchObject(
      {
        reason: "BOARD_COMPLETED",
      },
    );

    for (const title of ["활성 보드 1", "활성 보드 2", "활성 보드 3"]) {
      await boardApi.createBoard({
        profileId: profile.id,
        title,
        emoji: "🌱",
        targetCount: 30,
        rewardMemo: null,
        limitCount: 1,
      });
    }

    await expect(
      boardApi.createBoard({
        profileId: profile.id,
        title: "활성 보드 4",
        emoji: "🚫",
        targetCount: 30,
        rewardMemo: null,
        limitCount: 1,
      }),
    ).rejects.toBeInstanceOf(ActiveBoardLimitError);
  });
});

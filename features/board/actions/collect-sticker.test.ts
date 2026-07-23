import { BoardRecord } from "../types";
import { collectStickerAction } from "./collect-sticker";

jest.mock("../board.api", () => ({
  boardApi: {
    collectSticker: jest.fn(),
    getHomeBoards: jest.fn(),
    getTodayAchievement: jest.fn(),
  },
}));

jest.mock(
  "@/services/whale-message/service/whale-message.service",
  () => ({
    whaleMessageService: {
      onStickerCollected: jest.fn(),
    },
  }),
);

const updatedBoard: BoardRecord = {
  id: "board-1",
  createdAt: "2026-07-20T00:00:00.000Z",
  completedAt: null,
  title: "물 마시기",
  emoji: "💧",
  targetCount: 30,
  limitCount: 3,
  currentCount: 2,
  todayStickerCount: 2,
  latestStickerCollectedAt: "2026-07-23T00:00:00.000Z",
  currentStreak: 1,
  maxStreak: 1,
  todaySuccess: false,
  rewardMemo: null,
  status: "active",
};

const createDependencies = () => ({
  collectSticker: jest.fn().mockResolvedValue(updatedBoard),
  getHomeBoards: jest.fn().mockResolvedValue({
    items: [updatedBoard],
    pageInfo: {
      totalCount: 1,
    },
  }),
  getTodayAchievement: jest.fn().mockResolvedValue({
    count: 2,
  }),
  recordWhaleMessage: jest.fn().mockResolvedValue({
    message: {
      trigger: "sticker_acceleration" as const,
      body: "두 번째 스티커",
      pushEnabled: false,
    },
    log: null,
  }),
  reportSecondaryError: jest.fn(),
});

test("스티커 저장 후 서버의 최신 상태로 고래 메시지를 동기화한다", async () => {
  const dependencies = createDependencies();

  const result = await collectStickerAction(
    {
      boardId: "board-1",
      source: "app",
      profileId: "profile-1",
    },
    dependencies,
  );

  expect(result).toBe(updatedBoard);
  expect(dependencies.getHomeBoards).toHaveBeenCalledTimes(1);
  expect(dependencies.getTodayAchievement).toHaveBeenCalledWith("profile-1");
  expect(dependencies.recordWhaleMessage).toHaveBeenCalledWith({
    profileId: "profile-1",
    boards: [updatedBoard],
    todayStickerCount: 2,
  });
});

test("고래 메시지 후속 작업 실패는 스티커 저장 성공을 실패로 바꾸지 않는다", async () => {
  const dependencies = createDependencies();
  const secondaryError = new Error("message log failed");

  dependencies.recordWhaleMessage.mockRejectedValueOnce(secondaryError);

  await expect(
    collectStickerAction(
      {
        boardId: "board-1",
        source: "app",
        profileId: "profile-1",
      },
      dependencies,
    ),
  ).resolves.toBe(updatedBoard);
  expect(dependencies.reportSecondaryError).toHaveBeenCalledWith(secondaryError);
});

test("스티커 저장 자체가 실패하면 후속 작업을 실행하지 않는다", async () => {
  const dependencies = createDependencies();
  const primaryError = new Error("collect failed");

  dependencies.collectSticker.mockRejectedValueOnce(primaryError);

  await expect(
    collectStickerAction(
      {
        boardId: "board-1",
        source: "app",
        profileId: "profile-1",
      },
      dependencies,
    ),
  ).rejects.toBe(primaryError);
  expect(dependencies.getHomeBoards).not.toHaveBeenCalled();
  expect(dependencies.recordWhaleMessage).not.toHaveBeenCalled();
});

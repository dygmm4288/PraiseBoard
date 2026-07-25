import type { BoardSetupPayload } from "@/features/board/schema";
import type { BoardRecord } from "@/features/board/types";
import {
  OnboardingSetupError,
  saveOnboardingSetup,
} from "./save-onboarding-setup";

jest.mock("@/features/board/board.api", () => ({
  boardApi: {
    createBoard: jest.fn(),
  },
}));

jest.mock("@/services/user/user.api", () => ({
  userApi: {
    updateProfile: jest.fn(),
  },
}));

const payload: BoardSetupPayload = {
  profiles: {
    nickname: "두리",
  },
  boards: {
    title: "책 읽기",
    emoji: "📚",
    target_count: 30,
    reward_memo: "새 책",
    limit_count: 3,
  },
};

const createdBoard = {
  id: "board-1",
  title: "책 읽기",
} as BoardRecord;

test("프로필 저장 후 보드를 만들고 생성 결과를 반환한다", async () => {
  const updateProfile = jest.fn().mockResolvedValue({});
  const createBoard = jest.fn().mockResolvedValue(createdBoard);

  await expect(
    saveOnboardingSetup("profile-1", payload, {
      updateProfile,
      createBoard,
    }),
  ).resolves.toBe(createdBoard);

  expect(updateProfile).toHaveBeenCalledWith("profile-1", {
    nickname: "두리",
    reminderHour: 21,
    reminderMinute: 0,
    reminderTimes: [{ hour: 21, minute: 0 }],
  });
  expect(createBoard).toHaveBeenCalledWith({
    profileId: "profile-1",
    title: "책 읽기",
    emoji: "📚",
    targetCount: 30,
    rewardMemo: "새 책",
    limitCount: 3,
  });
  expect(updateProfile.mock.invocationCallOrder[0]).toBeLessThan(
    createBoard.mock.invocationCallOrder[0],
  );
});

test("프로필 저장 실패 시 보드를 만들지 않는다", async () => {
  const updateProfile = jest.fn().mockRejectedValue(new Error("profile"));
  const createBoard = jest.fn();

  await expect(
    saveOnboardingSetup("profile-1", payload, {
      updateProfile,
      createBoard,
    }),
  ).rejects.toMatchObject<Partial<OnboardingSetupError>>({
    stage: "profile",
  });
  expect(createBoard).not.toHaveBeenCalled();
});

test("보드 저장 실패 지점을 구분한다", async () => {
  const updateProfile = jest.fn().mockResolvedValue({});
  const createBoard = jest.fn().mockRejectedValue(new Error("board"));

  await expect(
    saveOnboardingSetup("profile-1", payload, {
      updateProfile,
      createBoard,
    }),
  ).rejects.toMatchObject<Partial<OnboardingSetupError>>({
    stage: "board",
  });
});

import { boardApi } from "@/features/board/board.api";
import type { BoardSetupPayload } from "@/features/board/schema";
import type { BoardRecord } from "@/features/board/types";
import { userApi } from "@/services/user/user.api";

export type OnboardingSetupStage = "profile" | "board";

export class OnboardingSetupError extends Error {
  constructor(
    readonly stage: OnboardingSetupStage,
    options: { cause: unknown },
  ) {
    super(`Failed to save onboarding ${stage}.`, options);
    this.name = "OnboardingSetupError";
  }
}

type SaveOnboardingSetupDependencies = {
  updateProfile: typeof userApi.updateProfile;
  createBoard: typeof boardApi.createBoard;
};

const defaultDependencies: SaveOnboardingSetupDependencies = {
  updateProfile: userApi.updateProfile,
  createBoard: boardApi.createBoard,
};

export const saveOnboardingSetup = async (
  profileId: string,
  payload: BoardSetupPayload,
  dependencies = defaultDependencies,
): Promise<BoardRecord> => {
  try {
    await dependencies.updateProfile(profileId, {
      nickname: payload.profiles.nickname,
    });
  } catch (cause) {
    throw new OnboardingSetupError("profile", { cause });
  }

  try {
    return await dependencies.createBoard({
      profileId,
      title: payload.boards.title,
      emoji: payload.boards.emoji,
      targetCount: payload.boards.target_count,
      rewardMemo: payload.boards.reward_memo,
      limitCount: payload.boards.limit_count,
    });
  } catch (cause) {
    throw new OnboardingSetupError("board", { cause });
  }
};

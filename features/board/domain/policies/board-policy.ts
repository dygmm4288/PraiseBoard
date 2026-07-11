export const MAX_ACTIVE_BOARD_COUNT = 3;
export const ACTIVE_BOARD_LIMIT_MESSAGE = "앗! 최대 3개를 다 만들었어요.";

export const canCreateBoard = (activeBoardCount: number) => {
  return activeBoardCount < MAX_ACTIVE_BOARD_COUNT;
};

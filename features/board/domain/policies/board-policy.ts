export const MAX_ACTIVE_BOARD_COUNT = 3;

export const canCreateBoard = (activeBoardCount: number) => {
  return activeBoardCount < MAX_ACTIVE_BOARD_COUNT;
};

import { whaleMessageService } from "@/services/whale-message/service/whale-message.service";
import { boardApi } from "../board.api";
import { BoardStickerSource } from "../types";

type CollectStickerInput = {
  boardId: string;
  source: BoardStickerSource;
  profileId: string | null;
};

type CollectStickerDependencies = {
  collectSticker: typeof boardApi.collectSticker;
  getHomeBoards: typeof boardApi.getHomeBoards;
  getTodayAchievement: typeof boardApi.getTodayAchievement;
  recordWhaleMessage: typeof whaleMessageService.onStickerCollected;
  reportSecondaryError: (error: unknown) => void;
};

const defaultDependencies: CollectStickerDependencies = {
  collectSticker: boardApi.collectSticker,
  getHomeBoards: boardApi.getHomeBoards,
  getTodayAchievement: boardApi.getTodayAchievement,
  recordWhaleMessage: whaleMessageService.onStickerCollected,
  reportSecondaryError: (error) => {
    console.warn("스티커 저장 후 고래 메시지 동기화에 실패했습니다.", error);
  },
};

const syncWhaleMessage = async (
  profileId: string,
  dependencies: CollectStickerDependencies,
) => {
  const [boardList, todayAchievement] = await Promise.all([
    dependencies.getHomeBoards(),
    dependencies.getTodayAchievement(profileId),
  ]);

  await dependencies.recordWhaleMessage({
    profileId,
    boards: boardList.items,
    todayStickerCount: todayAchievement.count,
  });
};

export const collectStickerAction = async (
  { boardId, source, profileId }: CollectStickerInput,
  dependencies: CollectStickerDependencies = defaultDependencies,
) => {
  const updatedBoard = await dependencies.collectSticker(boardId, source);

  if (profileId) {
    try {
      await syncWhaleMessage(profileId, dependencies);
    } catch (error) {
      dependencies.reportSecondaryError(error);
    }
  }

  return updatedBoard;
};

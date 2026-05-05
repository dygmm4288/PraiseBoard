import { supabase } from "@/shared/lib/supabase";
import {
  BoardRecord,
  BoardStatus,
  CollectStickerRpcResult,
  IBoardRepository,
} from "./types";

const BOARD_FIELDS =
  "id, title, emoji, reward_memo, target_count, limit_count, current_count, status";

const toBoardRecord = (row: {
  id: string;
  title: string;
  emoji?: string | null;
  target_count: number;
  limit_count?: number;
  current_count: number;
  today_sticker_count?: number;
  latest_sticker_collected_at?: string | null;
  current_streak?: number;
  max_streak?: number;
  today_success?: boolean;
  reward_memo: string | null;
  status: BoardStatus;
}): BoardRecord => ({
  id: row.id,
  title: row.title,
  emoji: row.emoji ?? "🐋",
  targetCount: row.target_count,
  limitCount: row.limit_count ?? 10,
  currentCount: row.current_count,
  todayStickerCount: row.today_sticker_count ?? 0,
  latestStickerCollectedAt: row.latest_sticker_collected_at || null,
  currentStreak: row.current_streak ?? 0,
  maxStreak: row.max_streak ?? 0,
  todaySuccess: row.today_success ?? false,
  rewardMemo: row.reward_memo,
  status: row.status,
});

export const boardRepository: IBoardRepository = {
  async createBoard({
    profileId,
    title,
    emoji,
    targetCount,
    rewardMemo,
    limitCount,
  }) {
    const { data, error } = await supabase
      .from("boards")
      .insert({
        profile_id: profileId,
        title,
        emoji,
        target_count: targetCount,
        reward_memo: rewardMemo,
        limit_count: limitCount,
      })
      .select(BOARD_FIELDS)
      .single();

    if (error) throw error;

    return toBoardRecord(data);
  },

  async collectSticker(boardId, source) {
    const { data: result, error } = await supabase.rpc("collect_sticker", {
      p_board_id: boardId,
      p_source: source,
    });

    if (error) throw error;

    const collectResult = result as CollectStickerRpcResult | null;

    if (!collectResult?.success) {
      const collectError = Object.assign(
        new Error(collectResult?.reason ?? "COLLECT_STICKER_FAILED"),
        {
          reason: collectResult?.reason,
          currentCount: collectResult?.current_count,
          limitCount: collectResult?.limit_count,
        },
      );

      throw collectError;
    }

    const { data, error: boardError } = await supabase
      .rpc("get_boards_with_stats")
      .eq("id", boardId)
      .single();
    if (boardError) throw boardError;

    return toBoardRecord(data);
  },

  async getBoards() {
    const { data, error } = await supabase.rpc("get_boards_with_stats");

    if (error) throw error;

    return data.map(toBoardRecord);
  },
};

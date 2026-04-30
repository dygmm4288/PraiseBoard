import { supabase } from "@/shared/lib/supabase";
import { BoardRecord, BoardStatus, IBoardRepository } from "./board.interface";

const BOARD_FIELDS =
  "id, title, reward_memo, target_count, current_count, status";

const toBoardRecord = (row: {
  id: string;
  title: string;
  target_count: number;
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
  targetCount: row.target_count,
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
  async createBoard({ profileId, title, targetCount, rewardMemo }) {
    const { data, error } = await supabase
      .from("boards")
      .insert({
        profile_id: profileId,
        title,
        target_count: targetCount,
        reward_memo: rewardMemo,
      })
      .select(BOARD_FIELDS)
      .single();

    if (error) throw error;

    return toBoardRecord(data);
  },

  async collectSticker(boardId, source) {
    const { error } = await supabase
      .rpc(`collect_sticker_${source}`, {
        board_id: boardId,
      })
      .select(BOARD_FIELDS);

    if (error) throw error;

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

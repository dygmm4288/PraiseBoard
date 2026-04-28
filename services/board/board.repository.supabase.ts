import { supabase } from "@/shared/lib/supabase";
import { BoardRecord, IBoardRepository } from "./board.interface";

const BOARD_FIELDS =
  "id, profile_id, title, reward_memo, target_count, current_count, status";

const toBoardRecord = (row: {
  id: string;
  profile_id: string;
  title: string;
  reward_memo: string | null;
  target_count: number;
  current_count: number;
  status: BoardRecord["status"];
}): BoardRecord => ({
  id: row.id,
  profileId: row.profile_id,
  title: row.title,
  rewardMemo: row.reward_memo,
  targetCount: row.target_count,
  currentCount: row.current_count,
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

  async getLatestBoard(profileId) {
    const { data, error } = await supabase
      .from("boards")
      .select(BOARD_FIELDS)
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return toBoardRecord(data);
  },

  async getBoardActivitySummary(boardId) {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const [
      { count, error: countError },
      { data: latestData, error: latestError },
    ] = await Promise.all([
      supabase
        .from("sticker_logs")
        .select("id", { count: "exact", head: true })
        .eq("board_id", boardId)
        .gte("created_at", todayStart.toISOString())
        .lt("created_at", tomorrowStart.toISOString()),
      supabase
        .from("sticker_logs")
        .select("created_at")
        .eq("board_id", boardId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (countError) throw countError;
    if (latestError) throw latestError;

    return {
      todayStickerCount: count ?? 0,
      latestStickerCollectedAt: latestData?.created_at ?? null,
    };
  },

  async getBoard(profileId, boardId) {
    const { data, error } = await supabase
      .from("boards")
      .select(BOARD_FIELDS)
      .eq("id", boardId)
      .eq("profile_id", profileId)
      .single();
    if (error) throw error;
    return toBoardRecord(data);
  },

  async collectSticker(boardId, source) {
    const { data, error } = await supabase
      .rpc(`collect_sticker_${source}`, {
        board_id: boardId,
      })
      .select(BOARD_FIELDS);

    if (error) throw error;

    return toBoardRecord(data);
  },

  async getBoards(profileId) {
    const { data, error } = await supabase
      .from("boards")
      .select(BOARD_FIELDS)
      .eq("profile_id", profileId);
    if (error) throw error;

    return data.map(toBoardRecord);
  },
};

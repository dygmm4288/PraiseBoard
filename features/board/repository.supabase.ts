import { supabase } from "@/shared/lib/supabase";
import {
  ensureSupabaseData,
  throwLoggedSupabaseError,
} from "@/shared/lib/supabase-error";
import { getTodayRange } from "@/shared/utils/date";
import {
  BoardRecord,
  BoardStatus,
  BoardTodayAchievement,
  CollectStickerRpcResult,
  IBoardRepository,
} from "./types";

const BOARD_FIELDS =
  "id, title, emoji, reward_memo, target_count, limit_count, current_count, status, created_at, completed_at";

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
  created_at?: string | null;
  completed_at?: string | null;
}): BoardRecord => ({
  id: row.id,
  createdAt: row.created_at ?? null,
  completedAt: row.status === "completed" ? (row.completed_at ?? null) : null,
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

    if (error) {
      throwLoggedSupabaseError(error, {
        domain: "board",
        operation: "createBoard",
        params: {
          profileId,
          title,
          emoji,
          targetCount,
          limitCount,
          hasRewardMemo: Boolean(rewardMemo),
        },
      });
    }
    const boardData = ensureSupabaseData(data, {
      domain: "board",
      operation: "createBoard.emptyData",
      params: {
        profileId,
        title,
      },
    });

    return toBoardRecord(boardData);
  },

  async updateBoard({ id, title, emoji, targetCount, rewardMemo, limitCount }) {
    const { data, error } = await supabase
      .from("boards")
      .update({
        title,
        emoji,
        target_count: targetCount,
        reward_memo: rewardMemo,
        limit_count: limitCount,
      })
      .eq("id", id)
      .select(BOARD_FIELDS)
      .single();

    if (error) {
      throwLoggedSupabaseError(error, {
        domain: "board",
        operation: "updateBoard",
        params: {
          id,
          title,
          emoji,
          targetCount,
          limitCount,
          hasRewardMemo: Boolean(rewardMemo),
        },
      });
    }
    const boardData = ensureSupabaseData(data, {
      domain: "board",
      operation: "updateBoard.emptyData",
      params: {
        id,
        title,
      },
    });

    return toBoardRecord(boardData);
  },

  async deleteBoard(boardId) {
    const { error } = await supabase.from("boards").delete().eq("id", boardId);

    if (error) {
      throwLoggedSupabaseError(error, {
        domain: "board",
        operation: "deleteBoard",
        params: {
          boardId,
        },
      });
    }
  },

  async collectSticker(boardId, source) {
    const { data: result, error } = await supabase.rpc("collect_sticker", {
      p_board_id: boardId,
      p_source: source,
    });

    if (error) {
      throwLoggedSupabaseError(error, {
        domain: "board",
        operation: "collectSticker.rpc.collect_sticker",
        params: {
          boardId,
          source,
        },
      });
    }

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
    if (boardError) {
      throwLoggedSupabaseError(boardError, {
        domain: "board",
        operation: "collectSticker.rpc.get_boards_with_stats",
        params: {
          boardId,
        },
      });
    }
    const boardData = ensureSupabaseData(data, {
      domain: "board",
      operation: "collectSticker.rpc.get_boards_with_stats.emptyData",
      params: {
        boardId,
      },
    });

    return toBoardRecord(boardData);
  },

  async getBoards(params) {
    const res = supabase.rpc("get_boards_with_stats", undefined, {
      count: "exact",
    });

    if (params.status) res.eq("status", params.status);
    if (params.page) {
      const limit = params.limit ?? 10;
      const page = params.page ?? 1;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      res.range(from, to);
    }

    const { data, error, count } = await res;

    if (error) {
      throwLoggedSupabaseError(error, {
        domain: "board",
        operation: "getBoards",
        params,
      });
    }
    const boardsData = ensureSupabaseData(data, {
      domain: "board",
      operation: "getBoards.emptyData",
      params,
    });

    return {
      items: boardsData.map(toBoardRecord),
      pageInfo: {
        page: params.page,
        limit: params.limit,
        totalCount: count ?? undefined,
      },
    };
  },

  async getHomeBoards() {
    const { start, end } = getTodayRange();
    const res = supabase.rpc("get_boards_with_stats", undefined, {
      count: "exact",
    });

    res.or(
      [
        "status.eq.active",
        `and(status.eq.completed,completed_at.gte.${start.toISOString()},completed_at.lt.${end.toISOString()})`,
      ].join(","),
    );

    const { data, error, count } = await res;

    if (error) {
      throwLoggedSupabaseError(error, {
        domain: "board",
        operation: "getHomeBoards",
        params: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });
    }
    const boardsData = ensureSupabaseData(data, {
      domain: "board",
      operation: "getHomeBoards.emptyData",
      params: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });

    return {
      items: boardsData.map(toBoardRecord),
      pageInfo: {
        totalCount: count ?? undefined,
      },
    };
  },

  async getTodayAchievement(profileId): Promise<BoardTodayAchievement> {
    const { start, end } = getTodayRange();

    const { count, error } = await supabase
      .from("sticker_logs")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString());

    if (error) {
      throwLoggedSupabaseError(error, {
        domain: "board",
        operation: "getTodayAchievement",
        params: {
          profileId,
          start: start.toISOString(),
          end: end.toISOString(),
        },
      });
    }

    return {
      count: count ?? 0,
    };
  },
};

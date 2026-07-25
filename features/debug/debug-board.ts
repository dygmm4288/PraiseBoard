import {
  ensureSupabaseData,
  throwLoggedSupabaseError,
} from "@/shared/lib/supabase-error";
import { supabase } from "@/shared/lib/supabase";

export const forceCompleteBoard = async (boardId: string) => {
  const { data: boardSnapshot, error: selectError } = await supabase
    .from("boards")
    .select("target_count, completed_at")
    .eq("id", boardId)
    .single();

  if (selectError) {
    throwLoggedSupabaseError(selectError, {
      domain: "debug",
      operation: "forceCompleteBoard.select",
      params: { boardId },
    });
  }

  const board = ensureSupabaseData(boardSnapshot, {
    domain: "debug",
    operation: "forceCompleteBoard.emptyData",
    params: { boardId },
  });
  const { error } = await supabase
    .from("boards")
    .update({
      status: "completed",
      current_count: board.target_count,
      completed_at: board.completed_at ?? new Date().toISOString(),
    })
    .eq("id", boardId);

  if (error) {
    throwLoggedSupabaseError(error, {
      domain: "debug",
      operation: "forceCompleteBoard.update",
      params: { boardId },
    });
  }
};

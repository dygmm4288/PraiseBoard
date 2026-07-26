import { trackEvent } from "../core/track-event";

export type BoardCreatedSource = "board_create" | "onboarding";
export type StickerSource = "app" | "widget";
export type ActiveLimitSource = "client" | "server";

/**
 * TODO(EAS-86)
 * - habit_category: board model과 분류 enum이 정의된 뒤 추가한다.
 * - emoji_type: emoji 원문이 아닌 분석용 분류 기준이 정의된 뒤 추가한다.
 */
export const boardAnalytics = {
  /** board 생성 API가 성공한 뒤 호출한다. title, emoji, reward는 전송하지 않는다. */
  created(source: BoardCreatedSource) {
    return trackEvent("board_created", { source });
  },

  /** board 수정 API가 성공한 뒤 호출한다. */
  updated() {
    return trackEvent("board_updated");
  },

  /** board 삭제 API가 성공한 뒤 호출한다. */
  deleted() {
    return trackEvent("board_deleted");
  },

  /** sticker 저장 API가 성공한 뒤 DB sticker_source만 전달한다. */
  stickerCollected(source: StickerSource) {
    return trackEvent("sticker_collected", { source });
  },

  /** 활성 board 제한이 client 정책 또는 server RPC에서 확정됐을 때 호출한다. */
  activeLimitReached(source: ActiveLimitSource) {
    return trackEvent("active_limit_reached", { source });
  },

  /** board 수정 sheet가 정상적으로 presentation 요청된 뒤 호출한다. */
  editStarted() {
    return trackEvent("board_edit_started");
  },
};

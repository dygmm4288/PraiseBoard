import type { AnalyticsEventName } from "../core/analytics.types";
import { trackEvent } from "../core/track-event";

export type AnalyticsView = "stats" | "archive" | "detail";

type ViewEventName = Extract<
  AnalyticsEventName,
  "stats_viewed" | "archive_viewed" | "detail_viewed"
>;

const VIEW_EVENT_NAMES = {
  stats: "stats_viewed",
  archive: "archive_viewed",
  detail: "detail_viewed",
} as const satisfies Record<AnalyticsView, ViewEventName>;

export const navigationAnalytics = {
  /** 사용자가 해당 화면에 진입해 screen component가 mount됐을 때 호출한다. */
  viewed(view: AnalyticsView) {
    return trackEvent(VIEW_EVENT_NAMES[view]);
  },
};

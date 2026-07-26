import type { AnalyticsAction } from "../core/analytics.types";
import { trackEvent } from "../core/track-event";

export const actionAnalytics = {
  /** 사용자 action이 실패한 catch/onError에서 고정 action 이름만 전달한다. */
  failed(action: AnalyticsAction) {
    return trackEvent("action_failed", { action });
  },
};

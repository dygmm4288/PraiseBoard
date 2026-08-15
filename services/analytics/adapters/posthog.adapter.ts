import type { AnalyticsAdapter } from "../core/analytics.adapter";
import { postHogClient } from "./posthog-client";

export const postHogAnalyticsAdapter: AnalyticsAdapter = {
  name: "posthog",
  identify(userId) {
    postHogClient.identify(userId);
  },
  track(eventName, properties) {
    postHogClient.capture(eventName, properties);
  },
};

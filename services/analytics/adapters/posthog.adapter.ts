import type { AnalyticsAdapter } from "../core/analytics.adapter";
import { postHogClient } from "./posthog-client";

export const postHogAnalyticsAdapter: AnalyticsAdapter = {
  name: "posthog",
  track(eventName, properties) {
    postHogClient.capture(eventName, properties);
  },
};

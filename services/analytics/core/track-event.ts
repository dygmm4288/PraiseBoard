import { reportError } from "@/shared/lib/report-error";
import type { AnalyticsAdapter } from "./analytics.adapter";
import { createTrackEvent } from "./create-track-event";
import { firebaseAnalyticsAdapter } from "../adapters/firebase.adapter";
import { postHogAnalyticsAdapter } from "../adapters/posthog.adapter";

const adapters: readonly AnalyticsAdapter[] = [
  postHogAnalyticsAdapter,
  firebaseAnalyticsAdapter,
];

export const trackEvent = createTrackEvent(adapters, (adapterName, error) => {
  reportError(error, {
    scope: `analytics.${adapterName}`,
    severity: "warning",
  });
});

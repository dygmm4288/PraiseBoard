import { reportError } from "@/shared/lib/report-error";
import type { AnalyticsAdapter } from "./analytics.adapter";
import { createTrackEvent } from "./create-track-event";
import { firebaseAnalyticsAdapter } from "../adapters/firebase.adapter";
import { postHogAnalyticsAdapter } from "../adapters/posthog.adapter";

const adapters: readonly AnalyticsAdapter[] = [
  postHogAnalyticsAdapter,
  firebaseAnalyticsAdapter,
];

const reportAnalyticsError = (adapterName: string, error: unknown) => {
  reportError(error, {
    scope: `analytics.${adapterName}`,
    severity: "warning",
  });
};

export const trackEvent = createTrackEvent(adapters, reportAnalyticsError);

export const identifyAnalyticsUser = async (userId: string) => {
  const identifyingAdapters = adapters.filter(
    (adapter) => adapter.identify !== undefined,
  );
  const results = await Promise.allSettled(
    identifyingAdapters.map((adapter) => adapter.identify?.(userId)),
  );

  results.forEach((result, index) => {
    if (result.status !== "rejected") return;
    reportAnalyticsError(identifyingAdapters[index].name, result.reason);
  });
};

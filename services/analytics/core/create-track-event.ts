import type { AnalyticsAdapter } from "./analytics.adapter";
import type { TrackEvent } from "./analytics.types";

type AnalyticsAdapterErrorHandler = (
  adapterName: string,
  error: unknown,
) => void;

export const createTrackEvent = (
  analyticsAdapters: readonly AnalyticsAdapter[],
  onAdapterError?: AnalyticsAdapterErrorHandler,
): TrackEvent => {
  const track: TrackEvent = async (eventName, ...args) => {
    const properties = args[0];

    const results = await Promise.allSettled(
      analyticsAdapters.map((adapter) =>
        Promise.resolve().then(() => adapter.track(eventName, properties)),
      ),
    );

    results.forEach((result, index) => {
      if (result.status !== "rejected" || !onAdapterError) return;

      try {
        onAdapterError(analyticsAdapters[index].name, result.reason);
      } catch {
        // Analytics diagnostics must never affect the user action.
      }
    });
  };

  return track;
};

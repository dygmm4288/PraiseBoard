import type {
  AnalyticsEventName,
  AnalyticsProperties,
} from "./analytics.types";

export type AnalyticsAdapter = {
  name: string;
  track: (
    eventName: AnalyticsEventName,
    properties?: AnalyticsProperties,
  ) => Promise<void> | void;
};

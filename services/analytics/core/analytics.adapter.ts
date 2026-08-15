import type {
  AnalyticsEventName,
  AnalyticsProperties,
} from "./analytics.types";

export type AnalyticsAdapter = {
  name: string;
  identify?: (userId: string) => Promise<void> | void;
  track: (
    eventName: AnalyticsEventName,
    properties?: AnalyticsProperties,
  ) => Promise<void> | void;
};

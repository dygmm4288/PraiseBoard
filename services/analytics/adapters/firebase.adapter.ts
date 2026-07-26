import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { Platform } from "react-native";
import type { AnalyticsAdapter } from "../core/analytics.adapter";
import type { AnalyticsProperties } from "../core/analytics.types";

const normalizeProperties = (properties?: AnalyticsProperties) => {
  if (!properties) return undefined;

  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [
      key,
      typeof value === "boolean" ? Number(value) : value,
    ]),
  );
};

export const firebaseAnalyticsAdapter: AnalyticsAdapter = {
  name: "firebase",
  async track(eventName, properties) {
    if (Platform.OS === "web") return;

    await logEvent(getAnalytics(), eventName, normalizeProperties(properties));
  },
};

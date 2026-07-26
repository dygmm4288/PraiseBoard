import { useEffect, useRef } from "react";
import {
  navigationAnalytics,
  type AnalyticsView,
} from "../events/navigation.analytics";

export const useTrackView = (view: AnalyticsView) => {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;

    hasTrackedRef.current = true;
    void navigationAnalytics.viewed(view);
  }, [view]);
};

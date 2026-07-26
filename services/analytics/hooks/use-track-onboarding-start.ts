import { useEffect, useRef } from "react";
import { onboardingAnalytics } from "../events/onboarding.analytics";

export const useTrackOnboardingStart = () => {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;

    hasTrackedRef.current = true;
    void onboardingAnalytics.started();
  }, []);
};

import type { OnboardingStep } from "../core/analytics.types";
import { trackEvent } from "../core/track-event";

export const onboardingAnalytics = {
  /** production onboarding screen이 처음 mount됐을 때 호출한다. */
  started() {
    return trackEvent("onboarding_started");
  },

  /** 입력 검증과 현재 step 처리가 끝나 다음 step으로 이동할 때 호출한다. */
  stepCompleted(step: OnboardingStep) {
    return trackEvent("onboarding_step_completed", { step });
  },
};

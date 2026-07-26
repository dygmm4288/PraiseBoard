import type { OnboardingStep } from "../core/analytics.types";
import { trackEvent } from "../core/track-event";

/**
 * TODO(EAS-86)
 * - days_since_install: 신뢰할 설치 시각 source가 정의된 뒤 추가한다.
 * - total_days_taken: 측정 시작점과 종료점이 정의된 뒤 추가한다.
 */
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

import { analytics } from "@/services/analytics";
import { completeStep } from "./onboard-screen";

jest.mock("@/services/analytics", () => ({
  analytics: {
    onboarding: {
      stepCompleted: jest.fn().mockResolvedValue(undefined),
    },
  },
  useTrackOnboardingStart: jest.fn(),
}));

jest.mock("@/shared/lib/supabase", () => ({
  supabase: {},
}));

const stepCompletedMock = jest.mocked(analytics.onboarding.stepCompleted);

beforeEach(() => {
  stepCompletedMock.mockClear();
});

test("현재 onboarding step 처리가 끝나 다음 step으로 이동할 때 기록한다", () => {
  const next = jest.fn();

  completeStep("name", next);

  expect(stepCompletedMock).toHaveBeenCalledWith("name");
  expect(next).toHaveBeenCalledTimes(1);
});

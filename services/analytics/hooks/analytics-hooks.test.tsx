import { renderHook, waitFor } from "@testing-library/react-native";
import { onboardingAnalytics } from "../events/onboarding.analytics";
import { useTrackOnboardingStart } from "./use-track-onboarding-start";

jest.mock("../events/onboarding.analytics", () => ({
  onboardingAnalytics: {
    started: jest.fn().mockResolvedValue(undefined),
  },
}));

const onboardingStartedMock = jest.mocked(onboardingAnalytics.started);

beforeEach(() => {
  onboardingStartedMock.mockClear();
});

test("onboarding production screen lifecycle마다 started를 한 번 기록한다", async () => {
  const first = await renderHook(() => useTrackOnboardingStart());

  await waitFor(() => expect(onboardingStartedMock).toHaveBeenCalledTimes(1));
  await first.rerender({});
  expect(onboardingStartedMock).toHaveBeenCalledTimes(1);

  await first.unmount();
  const second = await renderHook(() => useTrackOnboardingStart());
  await waitFor(() => expect(onboardingStartedMock).toHaveBeenCalledTimes(2));
  await second.unmount();
});

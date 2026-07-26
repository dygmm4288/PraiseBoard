import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { firebaseAnalyticsAdapter } from "./firebase.adapter";

jest.mock("@react-native-firebase/analytics", () => ({
  getAnalytics: jest.fn(() => "analytics-instance"),
  logEvent: jest.fn().mockResolvedValue(undefined),
}));

const getAnalyticsMock = jest.mocked(getAnalytics);
const logEventMock = jest.mocked(logEvent);

test("Firebase에는 boolean 속성을 숫자로 정규화해 전달한다", async () => {
  await firebaseAnalyticsAdapter.track("notification_toggle", {
    requested_enabled: true,
    result_enabled: false,
    permission_status: "granted",
  });

  expect(getAnalyticsMock).toHaveBeenCalledTimes(1);
  expect(logEventMock).toHaveBeenCalledWith(
    "analytics-instance",
    "notification_toggle",
    {
      requested_enabled: 1,
      result_enabled: 0,
      permission_status: "granted",
    },
  );
});

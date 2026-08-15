import {
  getAnalytics,
  logEvent,
  setUserId,
} from "@react-native-firebase/analytics";
import { firebaseAnalyticsAdapter } from "./firebase.adapter";

jest.mock("@react-native-firebase/analytics", () => ({
  getAnalytics: jest.fn(() => "analytics-instance"),
  logEvent: jest.fn().mockResolvedValue(undefined),
  setUserId: jest.fn().mockResolvedValue(undefined),
}));

const getAnalyticsMock = jest.mocked(getAnalytics);
const logEventMock = jest.mocked(logEvent);
const setUserIdMock = jest.mocked(setUserId);

test("Firebase 사용자 식별자를 설정한다", async () => {
  await firebaseAnalyticsAdapter.identify?.("profile-1");

  expect(setUserIdMock).toHaveBeenCalledWith(
    "analytics-instance",
    "profile-1",
  );
});

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

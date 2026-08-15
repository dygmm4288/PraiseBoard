import NetInfo from "@react-native-community/netinfo";
import { act, render, waitFor } from "@testing-library/react-native";
import type { AppStateStatus } from "react-native";
import { AppState } from "react-native";
import * as Application from "expo-application";
import { notification } from "@/services/notification";
import { analytics, identifyAnalyticsUser } from "@/services/analytics";
import AppLifecycleEffects from "./app-lifecycle-effects";

const mockUseUser = jest.fn(() => ({
  isInitialized: true,
  profileId: "profile-1",
}));

jest.mock("@/services/user", () => ({
  useUser: () => mockUseUser(),
}));

jest.mock("@/services/notification", () => ({
  notification: {
    bootstrap: jest.fn(),
    syncPushToken: jest.fn(),
  },
}));

jest.mock("@/services/analytics", () => ({
  analytics: {
    app: {
      opened: jest.fn().mockResolvedValue(undefined),
    },
  },
  identifyAnalyticsUser: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-application", () => ({
  getInstallationTimeAsync: jest.fn(),
}));

jest.mock("@react-native-community/netinfo", () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
  },
}));

const bootstrapMock = jest.mocked(notification.bootstrap);
const syncPushTokenMock = jest.mocked(notification.syncPushToken);
const addNetInfoListenerMock = jest.mocked(NetInfo.addEventListener);
const getInstallationTimeMock = jest.mocked(
  Application.getInstallationTimeAsync,
);
const identifyAnalyticsUserMock = jest.mocked(identifyAnalyticsUser);
const appOpenedMock = jest.mocked(analytics.app.opened);

beforeEach(() => {
  bootstrapMock.mockResolvedValue(jest.fn());
  syncPushTokenMock.mockResolvedValue(undefined);
  getInstallationTimeMock.mockResolvedValue(
    new Date("2026-08-12T00:00:00.000Z"),
  );
  jest.spyOn(Date, "now").mockReturnValue(
    new Date("2026-08-15T00:00:00.000Z").getTime(),
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("앱 수명주기 한 곳에서 알림 초기화와 활성화 동기화를 실행한다", async () => {
  let onAppStateChange: ((status: AppStateStatus) => void) | undefined;
  const removeAppStateListener = jest.fn();
  const removeNetInfoListener = jest.fn();
  addNetInfoListenerMock.mockReturnValue(removeNetInfoListener);
  const addAppStateListener = jest
    .spyOn(AppState, "addEventListener")
    .mockImplementation((_type, listener) => {
      onAppStateChange = listener;
      return { remove: removeAppStateListener };
    });

  const screen = await render(<AppLifecycleEffects />);

  await waitFor(() => {
    expect(bootstrapMock).toHaveBeenCalledTimes(1);
    expect(syncPushTokenMock).toHaveBeenCalledTimes(1);
    expect(addNetInfoListenerMock).toHaveBeenCalledTimes(1);
    expect(identifyAnalyticsUserMock).toHaveBeenCalledWith("profile-1");
    expect(appOpenedMock).toHaveBeenCalledWith(3);
  });

  await act(async () => {
    onAppStateChange?.("background");
  });
  expect(syncPushTokenMock).toHaveBeenCalledTimes(1);

  await act(async () => {
    onAppStateChange?.("active");
  });
  await waitFor(() => expect(syncPushTokenMock).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(appOpenedMock).toHaveBeenCalledTimes(2));

  await screen.unmount();
  expect(removeAppStateListener).toHaveBeenCalledTimes(1);
  expect(removeNetInfoListener).toHaveBeenCalledTimes(1);
});

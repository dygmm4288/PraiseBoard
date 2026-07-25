import { useNotificationSettings } from "@/services/notification";
import { render } from "@testing-library/react-native";
import SettingNotification from "./setting-notification";

jest.mock("@/services/user", () => ({
  useUser: () => ({ profileId: "profile-1" }),
}));

jest.mock("@/services/notification", () => ({
  useNotificationSettings: jest.fn(),
}));

jest.mock("@/shared/toasts/toast", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("@/shared/lib/report-error", () => ({
  reportError: jest.fn(),
}));

jest.mock("expo-intent-launcher", () => ({
  startActivityAsync: jest.fn(),
  ActivityAction: {
    APP_NOTIFICATION_SETTINGS: "APP_NOTIFICATION_SETTINGS",
  },
}));

const useNotificationSettingsMock = jest.mocked(useNotificationSettings);

test("21시 고정 안내를 표시하고 사용자 지정 시간 진입점은 숨긴다", async () => {
  useNotificationSettingsMock.mockReturnValue({
    settingsState: {
      pushToken: "ExponentPushToken[test]",
      pushEnabled: true,
      pushEnabledUpdatedAt: null,
      pushPermissionStatus: "granted",
      pushPermissionGrantedAt: null,
      pushPermissionUpdatedAt: null,
      permissionStatus: "granted",
      hasPermission: true,
      hasPushToken: true,
      isOperational: true,
    },
    isLoading: false,
    isUpdating: false,
    error: null,
    setPushEnabled: jest.fn(),
  });

  const screen = await render(
    <SettingNotification
      alarmTimeLabel="오전 10:00"
      onEditAlarmTime={jest.fn()}
    />,
  );

  expect(screen.getByText("오후 9시에 알림을 보내드려요")).toBeTruthy();
  expect(screen.queryByText("설정한 시간에 알림을 보내드려요")).toBeNull();
  expect(screen.queryByText("오전 10:00")).toBeNull();
});

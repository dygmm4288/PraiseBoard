import { NotificationSettingsState } from "../model/notification.interface";
import { notification } from "../service/notification.service";
import { useNotificationSettings } from "./use-notification-settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { PropsWithChildren } from "react";

jest.mock("../service/notification.service", () => ({
  notification: {
    getSettingsState: jest.fn(),
    setPushEnabledFromSettings: jest.fn(),
  },
}));

const getSettingsStateMock = jest.mocked(notification.getSettingsState);
const setPushEnabledMock = jest.mocked(
  notification.setPushEnabledFromSettings,
);

const disabledState: NotificationSettingsState = {
  pushToken: null,
  pushEnabled: false,
  pushEnabledUpdatedAt: null,
  pushPermissionStatus: "granted",
  pushPermissionGrantedAt: null,
  pushPermissionUpdatedAt: null,
  permissionStatus: "granted",
  hasPermission: true,
  hasPushToken: false,
  isOperational: false,
};

const enabledState: NotificationSettingsState = {
  ...disabledState,
  pushToken: "ExponentPushToken[test]",
  pushEnabled: true,
  hasPushToken: true,
  isOperational: true,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: Infinity,
        retry: false,
      },
      mutations: {
        gcTime: Infinity,
        retry: false,
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

beforeEach(() => {
  getSettingsStateMock.mockResolvedValue(disabledState);
  setPushEnabledMock.mockResolvedValue(undefined);
});

test("같은 profile의 알림 설정 조회를 공유한다", async () => {
  const { result } = await renderHook(
    () => ({
      first: useNotificationSettings("profile-1"),
      second: useNotificationSettings("profile-1"),
    }),
    {
      wrapper: createWrapper(),
    },
  );

  await waitFor(() => {
    expect(result.current.first.settingsState).toEqual(disabledState);
    expect(result.current.second.settingsState).toEqual(disabledState);
  });
  expect(getSettingsStateMock).toHaveBeenCalledTimes(1);
});

test("알림 변경 후 서버에서 다시 확인한 상태를 cache에 공유한다", async () => {
  getSettingsStateMock
    .mockResolvedValueOnce(disabledState)
    .mockResolvedValueOnce(enabledState);

  const { result } = await renderHook(
    () => ({
      first: useNotificationSettings("profile-1"),
      second: useNotificationSettings("profile-1"),
    }),
    {
      wrapper: createWrapper(),
    },
  );

  await waitFor(() =>
    expect(result.current.first.settingsState).toEqual(disabledState),
  );

  await act(async () => {
    await result.current.first.setPushEnabled(true);
  });

  await waitFor(() => {
    expect(result.current.first.settingsState).toEqual(enabledState);
    expect(result.current.second.settingsState).toEqual(enabledState);
  });
  expect(setPushEnabledMock).toHaveBeenCalledWith(true);
});

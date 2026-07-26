import { NotificationSettingsState } from "../model/notification.interface";
import { notification } from "../service/notification.service";
import { useNotificationSettings } from "./use-notification-settings";
import { analytics } from "@/services/analytics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { PropsWithChildren } from "react";

jest.mock("../service/notification.service", () => ({
  notification: {
    getSettingsState: jest.fn(),
    setPushEnabledFromSettings: jest.fn(),
  },
}));

jest.mock("@/services/analytics", () => ({
  analytics: {
    action: {
      failed: jest.fn().mockResolvedValue(undefined),
    },
    notification: {
      toggled: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

const getSettingsStateMock = jest.mocked(notification.getSettingsState);
const setPushEnabledMock = jest.mocked(
  notification.setPushEnabledFromSettings,
);
const notificationToggledMock = jest.mocked(analytics.notification.toggled);

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

const deniedState: NotificationSettingsState = {
  ...disabledState,
  pushPermissionStatus: "denied",
  permissionStatus: "denied",
  hasPermission: false,
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

  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
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
  expect(notificationToggledMock).toHaveBeenCalledWith({
    requestedEnabled: true,
    resultEnabled: true,
    permissionStatus: "granted",
  });
});

test("toggle 요청값과 서버에서 확인한 실제 결과를 분리한다", async () => {
  getSettingsStateMock
    .mockResolvedValueOnce(disabledState)
    .mockResolvedValueOnce(deniedState);
  const { result } = await renderHook(
    () => useNotificationSettings("profile-1"),
    { wrapper: createWrapper() },
  );
  await waitFor(() =>
    expect(result.current.settingsState).toEqual(disabledState),
  );

  await act(async () => {
    await result.current.setPushEnabled(true);
  });

  await waitFor(() =>
    expect(result.current.settingsState).toEqual(deniedState),
  );
  expect(notificationToggledMock).toHaveBeenCalledWith({
    requestedEnabled: true,
    resultEnabled: false,
    permissionStatus: "denied",
  });
});

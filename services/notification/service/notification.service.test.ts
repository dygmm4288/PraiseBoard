import { ensureAndroidChannels } from "@/infra/notification/channel";
import { localStorage } from "@/infra/storage";
import { analytics } from "@/services/analytics";
import * as Notifications from "expo-notifications";
import { notificationApi } from "../notification.api";
import { notification } from "./notification.service";

jest.mock("@/infra/notification/channel", () => ({
  ensureAndroidChannels: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/infra/storage", () => ({
  localStorage: {
    getItem: jest.fn(),
  },
}));

jest.mock("@/services/analytics", () => ({
  analytics: {
    notification: {
      permissionResolved: jest.fn().mockResolvedValue(undefined),
      received: jest.fn().mockResolvedValue(undefined),
      clicked: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

jest.mock("../notification.api", () => ({
  notificationApi: {
    getPushState: jest.fn(),
    savePushToken: jest.fn(),
  },
}));

jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    easConfig: { projectId: "project-1" },
  },
}));

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  getLastNotificationResponseAsync: jest.fn(),
  clearLastNotificationResponseAsync: jest.fn(),
}));

const ensureAndroidChannelsMock = jest.mocked(ensureAndroidChannels);
const getStorageItemMock = jest.mocked(localStorage.getItem);
const getPushStateMock = jest.mocked(notificationApi.getPushState);
const savePushTokenMock = jest.mocked(notificationApi.savePushToken);
const getPermissionsMock = jest.mocked(Notifications.getPermissionsAsync);
const requestPermissionsMock = jest.mocked(
  Notifications.requestPermissionsAsync,
);
const getExpoPushTokenMock = jest.mocked(
  Notifications.getExpoPushTokenAsync,
);
const permissionResolvedMock = jest.mocked(
  analytics.notification.permissionResolved,
);
const receivedMock = jest.mocked(analytics.notification.received);
const clickedMock = jest.mocked(analytics.notification.clicked);
const addReceivedListenerMock = jest.mocked(
  Notifications.addNotificationReceivedListener,
);
const addResponseListenerMock = jest.mocked(
  Notifications.addNotificationResponseReceivedListener,
);
const getLastResponseMock = jest.mocked(
  Notifications.getLastNotificationResponseAsync,
);
const clearLastResponseMock = jest.mocked(
  Notifications.clearLastNotificationResponseAsync,
);

const pushState = {
  pushToken: null,
  pushEnabled: false,
  pushEnabledUpdatedAt: null,
  pushPermissionStatus: "undetermined" as const,
  pushPermissionGrantedAt: null,
  pushPermissionUpdatedAt: null,
};

beforeEach(() => {
  ensureAndroidChannelsMock.mockResolvedValue(undefined);
  getStorageItemMock.mockImplementation(async (key) => {
    if (key === "profile_id") return "profile-1";
    if (key === "device_id") return "device-1";
    return null;
  });
  getPushStateMock.mockResolvedValue(pushState);
  savePushTokenMock.mockResolvedValue(undefined);
  addReceivedListenerMock.mockReturnValue({ remove: jest.fn() });
  addResponseListenerMock.mockReturnValue({ remove: jest.fn() });
  getLastResponseMock.mockResolvedValue(null);
  clearLastResponseMock.mockResolvedValue(undefined);
});

const createPushNotification = (pushId: string) =>
  ({
    request: {
      content: {
        data: {
          push_type: "daily_reminder",
          push_id: pushId,
        },
      },
    },
  }) as never;

test("bootstrap에서 push 수신과 클릭 listener를 등록하고 해제한다", async () => {
  const removeReceived = jest.fn();
  const removeResponse = jest.fn();
  let onReceived: ((value: never) => void) | undefined;
  let onResponse: ((value: never) => void) | undefined;
  addReceivedListenerMock.mockImplementation((listener) => {
    onReceived = listener as (value: never) => void;
    return { remove: removeReceived };
  });
  addResponseListenerMock.mockImplementation((listener) => {
    onResponse = listener as (value: never) => void;
    return { remove: removeResponse };
  });

  const dispose = await notification.bootstrap();
  const pushNotification = createPushNotification("push-listener-1");
  onReceived?.(pushNotification);
  onResponse?.({ notification: pushNotification } as never);

  expect(receivedMock).toHaveBeenCalledWith({
    pushType: "daily_reminder",
    pushId: "push-listener-1",
  });
  expect(clickedMock).toHaveBeenCalledWith({
    pushType: "daily_reminder",
    pushId: "push-listener-1",
  });

  dispose();
  expect(removeReceived).toHaveBeenCalledTimes(1);
  expect(removeResponse).toHaveBeenCalledTimes(1);
});

test("종료 상태에서 눌린 마지막 push를 한 번 기록하고 응답을 비운다", async () => {
  const pushNotification = createPushNotification("push-last-1");
  getLastResponseMock.mockResolvedValueOnce({
    notification: pushNotification,
  } as never);

  await notification.bootstrap();

  expect(clickedMock).toHaveBeenCalledWith({
    pushType: "daily_reminder",
    pushId: "push-last-1",
  });
  expect(clearLastResponseMock).toHaveBeenCalledTimes(1);
});

test("분석 식별자가 없는 push payload는 기록하지 않는다", async () => {
  let onReceived: ((value: never) => void) | undefined;
  addReceivedListenerMock.mockImplementation((listener) => {
    onReceived = listener as (value: never) => void;
    return { remove: jest.fn() };
  });

  await notification.bootstrap();
  onReceived?.({
    request: { content: { data: { trigger: "debug" } } },
  } as never);

  expect(receivedMock).not.toHaveBeenCalled();
});

test("거절된 permission을 저장한 뒤 결과를 기록한다", async () => {
  getPermissionsMock.mockResolvedValue({ status: "undetermined" } as never);
  requestPermissionsMock.mockResolvedValue({ status: "denied" } as never);

  await expect(
    notification.requestPermissionFromOnboarding(),
  ).resolves.toBe(false);

  expect(savePushTokenMock).toHaveBeenCalledWith(
    expect.objectContaining({
      pushEnabled: false,
      pushPermissionStatus: "denied",
    }),
  );
  expect(permissionResolvedMock).toHaveBeenCalledWith("denied");
  expect(savePushTokenMock.mock.invocationCallOrder[0]).toBeLessThan(
    permissionResolvedMock.mock.invocationCallOrder[0],
  );
});

test("허용된 permission과 token을 저장한 뒤 결과를 기록한다", async () => {
  getPermissionsMock.mockResolvedValue({ status: "granted" } as never);
  getExpoPushTokenMock.mockResolvedValue({
    data: "ExponentPushToken[test]",
  } as never);

  await expect(
    notification.requestPermissionFromOnboarding(),
  ).resolves.toBe(true);

  expect(savePushTokenMock).toHaveBeenCalledWith(
    expect.objectContaining({
      pushEnabled: true,
      pushPermissionStatus: "granted",
      pushToken: "ExponentPushToken[test]",
    }),
  );
  expect(permissionResolvedMock).toHaveBeenCalledWith("granted");
});

test("push state 저장 실패에는 permission 결과를 기록하지 않는다", async () => {
  const error = new Error("save failed");
  getPermissionsMock.mockResolvedValue({ status: "denied" } as never);
  savePushTokenMock.mockRejectedValueOnce(error);

  await expect(
    notification.requestPermissionFromOnboarding(),
  ).rejects.toBe(error);
  expect(permissionResolvedMock).not.toHaveBeenCalled();
});

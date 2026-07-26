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

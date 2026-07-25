import { localStorage } from "@/infra/storage";
import { notificationApi } from "@/services/notification/notification.api";
import * as Notifications from "expo-notifications";
import { getNotificationDebugSnapshot } from "./debug-notification";

jest.mock("@/infra/storage", () => ({
  localStorage: {
    getItem: jest.fn(),
  },
}));

jest.mock("@/services/notification/notification.api", () => ({
  notificationApi: {
    getPushState: jest.fn(),
  },
}));

jest.mock("expo-notifications", () => ({
  getPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
}));

const getItemMock = jest.mocked(localStorage.getItem);
const getPushStateMock = jest.mocked(notificationApi.getPushState);
const getPermissionsMock = jest.mocked(Notifications.getPermissionsAsync);

beforeEach(() => {
  getPermissionsMock.mockResolvedValue({
    status: "granted",
  } as Notifications.NotificationPermissionsStatus);
  getItemMock.mockImplementation(async (key) => {
    if (key === "profile_id") return "profile-1";
    if (key === "device_id") return "device-1";
    return null;
  });
  getPushStateMock.mockResolvedValue({
    pushToken: "token",
    pushEnabled: true,
    pushEnabledUpdatedAt: null,
    pushPermissionStatus: "granted",
    pushPermissionGrantedAt: null,
    pushPermissionUpdatedAt: null,
  });
});

test("debug 알림 상태를 한 번에 조회한다", async () => {
  await expect(getNotificationDebugSnapshot()).resolves.toMatchObject({
    profileId: "profile-1",
    deviceId: "device-1",
    osPermissionStatus: "granted",
    pushState: {
      pushEnabled: true,
    },
  });
  expect(getPushStateMock).toHaveBeenCalledWith("profile-1", "device-1");
});

test("기기 연결 정보가 없으면 DB 조회 없이 빈 push 상태를 반환한다", async () => {
  getItemMock.mockResolvedValue(null);

  await expect(getNotificationDebugSnapshot()).resolves.toMatchObject({
    profileId: null,
    deviceId: null,
    pushState: null,
  });
  expect(getPushStateMock).not.toHaveBeenCalled();
});

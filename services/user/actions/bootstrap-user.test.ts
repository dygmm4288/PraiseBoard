import { UserProfile } from "../model/user.interface";
import { bootstrapUser } from "./bootstrap-user";

jest.mock("@/infra/storage", () => ({
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(),
}));

jest.mock("../user.api", () => ({
  userApi: {
    ensureAnonymousSession: jest.fn(),
    getCurrentAuthUser: jest.fn(),
    getMyProfile: jest.fn(),
    createProfile: jest.fn(),
    ensureDeviceLink: jest.fn(),
    syncLoginMetadata: jest.fn(),
  },
}));

const profile = {
  id: "profile-1",
} as UserProfile;

const createDependencies = () => ({
  ensureAnonymousSession: jest.fn().mockResolvedValue("auth-1"),
  getCurrentAuthUser: jest.fn().mockResolvedValue({
    authUserId: "auth-1",
    authState: "anonymous" as const,
  }),
  getMyProfile: jest.fn().mockResolvedValue(profile),
  createProfile: jest.fn().mockResolvedValue(profile),
  ensureDeviceLink: jest.fn().mockResolvedValue(undefined),
  syncLoginMetadata: jest.fn().mockResolvedValue(undefined),
  storage: {
    getItem: jest.fn().mockResolvedValue("device-1"),
    setItem: jest.fn().mockResolvedValue(undefined),
  },
  createDeviceId: jest.fn().mockReturnValue("new-device"),
  reportSecondaryError: jest.fn(),
});

test("기존 프로필과 device ID를 재사용한다", async () => {
  const dependencies = createDependencies();

  const result = await bootstrapUser(dependencies);

  expect(result).toEqual({
    authUserId: "auth-1",
    profileId: "profile-1",
    deviceId: "device-1",
    authState: "anonymous",
  });
  expect(dependencies.createProfile).not.toHaveBeenCalled();
  expect(dependencies.createDeviceId).not.toHaveBeenCalled();
  expect(dependencies.ensureDeviceLink).toHaveBeenCalledWith(
    "device-1",
    "profile-1",
  );
});

test("프로필과 device ID가 없으면 생성한다", async () => {
  const dependencies = createDependencies();

  dependencies.getMyProfile.mockResolvedValueOnce(null);
  dependencies.storage.getItem.mockResolvedValueOnce(null);

  const result = await bootstrapUser(dependencies);

  expect(dependencies.createProfile).toHaveBeenCalledWith("auth-1");
  expect(dependencies.createDeviceId).toHaveBeenCalledTimes(1);
  expect(dependencies.storage.setItem).toHaveBeenCalledWith(
    "device_id",
    "new-device",
  );
  expect(result.deviceId).toBe("new-device");
});

test("로그인 메타데이터 실패는 초기화 성공을 막지 않는다", async () => {
  const dependencies = createDependencies();
  const metadataError = new Error("metadata failed");

  dependencies.syncLoginMetadata.mockRejectedValueOnce(metadataError);

  await expect(bootstrapUser(dependencies)).resolves.toEqual(
    expect.objectContaining({
      profileId: "profile-1",
    }),
  );
  expect(dependencies.reportSecondaryError).toHaveBeenCalledWith(metadataError);
});

test("필수 device 연결 실패는 초기화 실패로 반환한다", async () => {
  const dependencies = createDependencies();
  const deviceError = new Error("device link failed");

  dependencies.ensureDeviceLink.mockRejectedValueOnce(deviceError);

  await expect(bootstrapUser(dependencies)).rejects.toBe(deviceError);
  expect(dependencies.storage.setItem).not.toHaveBeenCalled();
});

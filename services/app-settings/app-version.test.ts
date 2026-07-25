import {
  AppStoreOpenError,
  openAppStore,
  resolveAppUpdateStatus,
  resolveStoreUrls,
  type AppRuntimeInfo,
} from "./app-version";

const runtimeInfo: AppRuntimeInfo = {
  appName: "Praise Board",
  applicationId: "com.example.praiseboard",
  currentVersion: "1.0.0",
  iosAppStoreId: null,
  platform: "ios",
};

describe("앱 업데이트 판단", () => {
  test("최소 지원 버전보다 낮으면 필수 업데이트다", () => {
    expect(
      resolveAppUpdateStatus({
        currentVersion: "1.1.9",
        minimumVersion: "1.2.0",
        latestVersion: "1.4.0",
      }),
    ).toBe("required");
  });

  test("최소 버전은 충족하지만 최신 버전보다 낮으면 선택 업데이트다", () => {
    expect(
      resolveAppUpdateStatus({
        currentVersion: "1.3.0",
        minimumVersion: "1.2.0",
        latestVersion: "1.4.0",
      }),
    ).toBe("available");
  });

  test("최신 버전 이상이면 현재 버전으로 판단한다", () => {
    expect(
      resolveAppUpdateStatus({
        currentVersion: "1.4.1",
        minimumVersion: "1.2.0",
        latestVersion: "1.4.0",
      }),
    ).toBe("current");
  });

  test("버전 자릿수가 달라도 숫자 기준으로 비교한다", () => {
    expect(
      resolveAppUpdateStatus({
        currentVersion: "1.2",
        minimumVersion: "1.2.0",
        latestVersion: "1.2.0",
      }),
    ).toBe("current");
  });
});

describe("스토어 URL 판단", () => {
  test("iOS App Store ID가 있으면 앱 링크와 웹 링크를 만든다", () => {
    expect(
      resolveStoreUrls({
        ...runtimeInfo,
        iosAppStoreId: "id123456789",
      }),
    ).toEqual([
      "itms-apps://apps.apple.com/app/id123456789",
      "https://apps.apple.com/app/id123456789",
    ]);
  });

  test("iOS App Store ID가 없으면 앱 이름 검색 링크를 사용한다", () => {
    expect(resolveStoreUrls(runtimeInfo)).toEqual([
      "https://apps.apple.com/search?term=Praise%20Board",
    ]);
  });

  test("Android는 market 링크와 HTTPS fallback을 만든다", () => {
    expect(
      resolveStoreUrls({
        ...runtimeInfo,
        platform: "android",
      }),
    ).toEqual([
      "market://details?id=com.example.praiseboard",
      "https://play.google.com/store/apps/details?id=com.example.praiseboard",
    ]);
  });

  test("웹은 앱 이름으로 검색하는 URL을 만든다", () => {
    expect(
      resolveStoreUrls({
        ...runtimeInfo,
        applicationId: null,
        platform: "web",
      }),
    ).toEqual([
      "https://www.google.com/search?q=Praise%20Board%20app%20store",
    ]);
  });
});

describe("스토어 열기", () => {
  const androidRuntime: AppRuntimeInfo = {
    ...runtimeInfo,
    platform: "android",
  };

  test("네이티브 링크가 실패하면 웹 링크로 다시 시도한다", async () => {
    const openUrl = jest
      .fn()
      .mockRejectedValueOnce(new Error("market unavailable"))
      .mockResolvedValueOnce(undefined);

    await expect(openAppStore(androidRuntime, openUrl)).resolves.toBeUndefined();
    expect(openUrl).toHaveBeenNthCalledWith(
      1,
      "market://details?id=com.example.praiseboard",
    );
    expect(openUrl).toHaveBeenNthCalledWith(
      2,
      "https://play.google.com/store/apps/details?id=com.example.praiseboard",
    );
  });

  test("모든 링크가 실패하면 명시적인 오류를 반환한다", async () => {
    const openUrl = jest.fn().mockRejectedValue(new Error("unavailable"));

    await expect(openAppStore(androidRuntime, openUrl)).rejects.toBeInstanceOf(
      AppStoreOpenError,
    );
  });
});

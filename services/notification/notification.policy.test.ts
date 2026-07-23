import { PushState } from "./model/notification.interface";
import { resolveNotificationSettingsState } from "./notification.policy";

const pushState: PushState = {
  pushToken: "ExponentPushToken[test]",
  pushEnabled: true,
  pushEnabledUpdatedAt: null,
  pushPermissionStatus: "granted",
  pushPermissionGrantedAt: null,
  pushPermissionUpdatedAt: null,
};

test("DB 설정, OS 권한, push token이 모두 있으면 알림을 사용할 수 있다", () => {
  expect(
    resolveNotificationSettingsState(pushState, "granted"),
  ).toEqual(
    expect.objectContaining({
      hasPermission: true,
      hasPushToken: true,
      isOperational: true,
    }),
  );
});

test("DB가 enabled여도 OS 권한이 거부되면 사용할 수 없다", () => {
  expect(
    resolveNotificationSettingsState(pushState, "denied"),
  ).toEqual(
    expect.objectContaining({
      hasPermission: false,
      isOperational: false,
    }),
  );
});

test("OS 권한이 있어도 push token이 없으면 사용할 수 없다", () => {
  expect(
    resolveNotificationSettingsState(
      {
        ...pushState,
        pushToken: null,
      },
      "granted",
    ),
  ).toEqual(
    expect.objectContaining({
      hasPushToken: false,
      isOperational: false,
    }),
  );
});

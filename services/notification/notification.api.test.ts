import { supabase } from "@/shared/lib/supabase";
import { notificationApi } from "./notification.api";

jest.mock("@/shared/lib/supabase", () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

const invokeMock = jest.mocked(supabase.functions.invoke);

test("현재 profile_id와 device_id로 테스트 푸시 함수를 호출한다", async () => {
  invokeMock.mockResolvedValue({
    data: {
      ok: true,
      notificationLogId: "log-1",
      ticketId: "ticket-1",
      sentAt: "2026-07-25T12:00:00.000Z",
    },
    error: null,
  });

  await expect(
    notificationApi.sendTestPush("profile-1", "device-1"),
  ).resolves.toEqual({
    notificationLogId: "log-1",
    ticketId: "ticket-1",
    sentAt: "2026-07-25T12:00:00.000Z",
  });
  expect(invokeMock).toHaveBeenCalledWith("send-test-push", {
    body: {
      profileId: "profile-1",
      deviceId: "device-1",
    },
  });
});

test("테스트 푸시 함수 호출 실패를 전달한다", async () => {
  const error = new Error("request failed");
  invokeMock.mockResolvedValue({
    data: null,
    error,
  });

  await expect(
    notificationApi.sendTestPush("profile-1", "device-1"),
  ).rejects.toBe(error);
});

test("필수 발송 결과가 없으면 잘못된 응답으로 처리한다", async () => {
  invokeMock.mockResolvedValue({
    data: {
      ok: true,
    },
    error: null,
  });

  await expect(
    notificationApi.sendTestPush("profile-1", "device-1"),
  ).rejects.toThrow("Test push response is invalid.");
});

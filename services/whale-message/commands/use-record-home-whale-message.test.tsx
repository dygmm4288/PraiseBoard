import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { PropsWithChildren } from "react";
import type {
  WhaleMessage,
  WhaleMessageResult,
} from "../model/whale-message.interface";
import { whaleMessageKeys } from "../queries/whale-message.query.key";
import { whaleMessageService } from "../service/whale-message.service";
import { useRecordHomeWhaleMessage } from "./use-record-home-whale-message";

jest.mock("../service/whale-message.service", () => ({
  whaleMessageService: {
    recordInAppMessage: jest.fn(),
  },
}));

const recordInAppMessageMock = jest.mocked(
  whaleMessageService.recordInAppMessage,
);

const message: WhaleMessage = {
  trigger: "default_morning",
  body: "좋은 아침이에요.",
  pushEnabled: false,
};

const result: WhaleMessageResult = {
  message,
  log: {
    id: "log-1",
    profileId: "profile-1",
    channel: "in_app",
    type: "default_morning",
    messageTrigger: "default_morning",
    messageBody: "좋은 아침이에요.",
    createdAt: "2026-07-24T00:00:00.000Z",
    sentAt: null,
    openAt: null,
  },
};

const createTestContext = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { gcTime: Infinity, retry: false },
      mutations: { gcTime: Infinity, retry: false },
    },
  });

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
};

beforeEach(() => {
  recordInAppMessageMock.mockResolvedValue(result);
});

test("화면 진입만으로 기록하지 않고 명령을 호출할 때만 저장한다", async () => {
  const { queryClient, wrapper } = createTestContext();
  const { result: hook } = await renderHook(
    () => useRecordHomeWhaleMessage(),
    {
      wrapper,
    },
  );

  expect(recordInAppMessageMock).not.toHaveBeenCalled();

  await act(async () => {
    await hook.current.mutateAsync({
      profileId: "profile-1",
      message,
    });
  });

  await waitFor(() => expect(hook.current.isSuccess).toBe(true));
  expect(recordInAppMessageMock).toHaveBeenCalledWith("profile-1", message);
  expect(
    queryClient.getQueryData(whaleMessageKeys.latest("profile-1")),
  ).toEqual(result.log);
});

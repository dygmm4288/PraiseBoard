import { analytics } from "@/services/analytics";
import { useTopLevelSheet } from "@/shared/components/bottom-sheet/top-level-sheet-provider";
import { toast } from "@/shared/toasts/toast";
import { act, renderHook } from "@testing-library/react-native";
import { useActiveBoardQuery } from "../queries/use-board-query";
import { useBoardSheet } from "./use-board-sheet";

jest.mock("@/services/user", () => ({
  useUser: () => ({ profileId: "profile-1" }),
}));

jest.mock("@/services/analytics", () => ({
  analytics: {
    board: {
      activeLimitReached: jest.fn().mockResolvedValue(undefined),
      editStarted: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

jest.mock("@/shared/components/bottom-sheet/top-level-sheet-provider", () => ({
  useTopLevelSheet: jest.fn(),
}));

jest.mock("../queries/use-board-query", () => ({
  useActiveBoardQuery: jest.fn(),
}));

jest.mock("@/shared/toasts/toast", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("@/features/board/components/board-create/board-create", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock(
  "@/features/board/components/board-create/board-edit-sheet-content",
  () => ({
    __esModule: true,
    default: () => null,
  }),
);

const presentTopLevelSheetMock = jest.fn();
const useTopLevelSheetMock = jest.mocked(useTopLevelSheet);
const useActiveBoardQueryMock = jest.mocked(useActiveBoardQuery);
const activeLimitReachedMock = jest.mocked(
  analytics.board.activeLimitReached,
);
const editStartedMock = jest.mocked(analytics.board.editStarted);

const board = {
  id: "board-1",
  title: "산책하기",
  emoji: "🌱",
  targetCount: 30,
  currentCount: 10,
  limitCount: 1,
  rewardMemo: "",
};

beforeEach(() => {
  useTopLevelSheetMock.mockReturnValue({
    presentTopLevelSheet: presentTopLevelSheetMock,
  });
  useActiveBoardQueryMock.mockReturnValue({
    data: { items: [] },
  } as unknown as ReturnType<typeof useActiveBoardQuery>);
});

test("edit sheet 요청이 수락된 경우에만 started를 기록한다", async () => {
  presentTopLevelSheetMock.mockReturnValueOnce(true).mockReturnValueOnce(false);
  const { result } = await renderHook(() => useBoardSheet());

  await act(async () => {
    result.current.openEditSheet(board);
    result.current.openEditSheet(board);
  });

  expect(editStartedMock).toHaveBeenCalledTimes(1);
});

test("client 활성 board 제한에서만 limit event를 기록한다", async () => {
  useActiveBoardQueryMock.mockReturnValue({
    data: { items: [{}, {}, {}] },
  } as unknown as ReturnType<typeof useActiveBoardQuery>);
  const { result } = await renderHook(() => useBoardSheet());

  await act(async () => {
    result.current.openCreateSheet();
  });

  expect(activeLimitReachedMock).toHaveBeenCalledWith("client");
  expect(presentTopLevelSheetMock).not.toHaveBeenCalled();
  expect(toast.error).toHaveBeenCalled();
});

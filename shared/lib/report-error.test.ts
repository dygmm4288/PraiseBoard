import { reportError } from "./report-error";

afterEach(() => {
  jest.restoreAllMocks();
});

test("예상하지 못한 오류를 작업 위치와 함께 기록한다", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation();
  const error = new Error("failed");

  reportError(error, {
    scope: "board.create",
    details: { boardId: "board-1" },
  });

  expect(consoleError).toHaveBeenCalledWith("[Error][board.create]", {
    error,
    details: { boardId: "board-1" },
  });
});

test("같은 오류가 여러 곳을 지나가도 한 번만 기록한다", () => {
  const consoleError = jest.spyOn(console, "error").mockImplementation();
  const error = new Error("failed");

  reportError(error, { scope: "board.api" });
  reportError(error, { scope: "board.screen" });

  expect(consoleError).toHaveBeenCalledTimes(1);
});

test("주요 작업을 막지 않는 부가 작업 실패는 warning으로 기록한다", () => {
  const consoleWarn = jest.spyOn(console, "warn").mockImplementation();
  const error = new Error("secondary failed");

  reportError(error, {
    scope: "board.collect.syncWhaleMessage",
    severity: "warning",
  });

  expect(consoleWarn).toHaveBeenCalledWith(
    "[Warning][board.collect.syncWhaleMessage]",
    { error },
  );
});

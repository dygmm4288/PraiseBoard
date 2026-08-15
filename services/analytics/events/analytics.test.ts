import { trackEvent } from "../core/track-event";
import { analytics } from "./analytics";

jest.mock("../core/track-event", () => ({
  trackEvent: jest.fn().mockResolvedValue(undefined),
}));

const trackEventMock = jest.mocked(trackEvent);

test("board facade가 고정된 event contract로 변환한다", async () => {
  const activeBoard = {
    id: "board-1",
    targetCount: 20,
    currentCount: 5,
    status: "active",
    createdAt: "2026-08-01T00:00:00.000Z",
    completedAt: null,
  };

  void analytics.board.created(activeBoard, "board_create");
  void analytics.board.updated(activeBoard.id);
  void analytics.board.deleted(activeBoard);
  void analytics.board.deleteCancelled(activeBoard.id);
  await analytics.board.stickerCollected(activeBoard, "app");
  void analytics.board.activeLimitReached("server");
  void analytics.board.editStarted();

  expect(trackEventMock.mock.calls).toEqual([
    [
      "board_created",
      {
        source: "board_create",
        board_id: "board-1",
        target_count: 20,
        is_first_board: false,
      },
    ],
    ["board_updated", { board_id: "board-1" }],
    [
      "board_deleted",
      { board_id: "board-1", progress_at_deletion: 25 },
    ],
    ["board_delete_cancelled", { board_id: "board-1" }],
    [
      "sticker_collected",
      {
        source: "app",
        board_id: "board-1",
        current_progress: 25,
        is_first_check: false,
      },
    ],
    ["active_limit_reached", { source: "server" }],
    ["board_edit_started"],
  ]);
});

test("완료된 board의 sticker 저장 결과로 완주 이벤트를 기록한다", async () => {
  await analytics.board.stickerCollected(
    {
      id: "board-2",
      targetCount: 10,
      currentCount: 10,
      status: "completed",
      createdAt: "2026-08-01T00:00:00.000Z",
      completedAt: "2026-08-03T00:00:00.000Z",
    },
    "widget",
  );

  expect(trackEventMock.mock.calls).toEqual([
    [
      "sticker_collected",
      {
        source: "widget",
        board_id: "board-2",
        current_progress: 100,
        is_first_check: false,
      },
    ],
    [
      "board_completed",
      { board_id: "board-2", total_days_taken: 2 },
    ],
  ]);
});

test("화면 이름을 view event로 변환한다", () => {
  void analytics.navigation.viewed("stats");
  void analytics.navigation.viewed("archive");
  void analytics.navigation.viewed("detail");

  expect(trackEventMock.mock.calls).toEqual([
    ["stats_viewed"],
    ["archive_viewed"],
    ["detail_viewed"],
  ]);
});

test("onboarding facade가 시작과 완료 step만 노출한다", () => {
  void analytics.onboarding.started();
  void analytics.onboarding.stepCompleted("title");

  expect(trackEventMock.mock.calls).toEqual([
    ["onboarding_started"],
    ["onboarding_step_completed", { step: "title" }],
  ]);
});

test("notification facade가 내부 property 이름으로 변환한다", () => {
  void analytics.notification.toggled({
    requestedEnabled: true,
    resultEnabled: false,
    permissionStatus: "granted",
  });
  void analytics.notification.permissionResolved("denied");
  void analytics.notification.received({
    pushType: "daily_reminder",
    pushId: "push-1",
  });
  void analytics.notification.clicked({
    pushType: "daily_reminder",
    pushId: "push-1",
  });

  expect(trackEventMock.mock.calls).toEqual([
    [
      "notification_toggle",
      {
        requested_enabled: true,
        result_enabled: false,
        permission_status: "granted",
      },
    ],
    ["notification_permission_result", { status: "denied" }],
    [
      "push_received",
      { push_type: "daily_reminder", push_id: "push-1" },
    ],
    [
      "push_clicked",
      { push_type: "daily_reminder", push_id: "push-1" },
    ],
  ]);
});

test("app facade가 설치 후 경과일을 정수로 정규화한다", () => {
  void analytics.app.opened(3.8);

  expect(trackEventMock).toHaveBeenCalledWith("app_opened", {
    days_since_install: 3,
  });
});

test("action failure는 고정 action 이름만 전달한다", () => {
  void analytics.action.failed("board_create");

  expect(trackEventMock).toHaveBeenCalledWith("action_failed", {
    action: "board_create",
  });
});

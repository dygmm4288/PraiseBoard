import { resolveWhaleMessage } from "./whale-message.policy";

const board = ({
  id,
  limitCount,
  todayStickerCount,
  status = "active",
}: {
  id: string;
  limitCount: number;
  todayStickerCount: number;
  status?: string;
}) => ({
  id,
  limitCount,
  todayStickerCount,
  status,
  targetCount: 100,
  currentCount: 0,
  rewardMemo: null,
});

const resolveTrigger = (boards: ReturnType<typeof board>[]) =>
  resolveWhaleMessage({
    boards,
    todayStickerCount: 0,
    now: new Date("2026-07-17T10:00:00.000Z"),
  }).trigger;

test("일부 활성 보드만 당일 목표를 채우면 일일 목표 완료 메시지를 표시하지 않는다", () => {
  expect(
    resolveTrigger([
      board({ id: "one", limitCount: 2, todayStickerCount: 2 }),
      board({ id: "two", limitCount: 3, todayStickerCount: 0 }),
    ]),
  ).not.toBe("daily_limit_reached");
});

test("모든 활성 보드의 당일 목표를 채우면 일일 목표 완료 메시지를 표시한다", () => {
  expect(
    resolveTrigger([
      board({ id: "one", limitCount: 2, todayStickerCount: 2 }),
      board({ id: "two", limitCount: 3, todayStickerCount: 3 }),
    ]),
  ).toBe("daily_limit_reached");
});

test("목표가 다른 복수 활성 보드는 각자의 목표를 모두 충족해야 한다", () => {
  const boards = [
    board({ id: "one", limitCount: 1, todayStickerCount: 1 }),
    board({ id: "two", limitCount: 5, todayStickerCount: 4 }),
  ];

  expect(resolveTrigger(boards)).not.toBe("daily_limit_reached");
  expect(
    resolveTrigger([
      boards[0],
      board({ id: "two", limitCount: 5, todayStickerCount: 5 }),
    ]),
  ).toBe("daily_limit_reached");
});

test("오늘 완료된 보드는 제외하고 남은 활성 보드만으로 판정한다", () => {
  const completedBoard = board({
    id: "completed",
    limitCount: 1,
    todayStickerCount: 1,
    status: "completed",
  });

  expect(
    resolveTrigger([
      completedBoard,
      board({ id: "active", limitCount: 3, todayStickerCount: 2 }),
    ]),
  ).not.toBe("daily_limit_reached");
  expect(
    resolveTrigger([
      completedBoard,
      board({ id: "active", limitCount: 3, todayStickerCount: 3 }),
    ]),
  ).toBe("daily_limit_reached");
});

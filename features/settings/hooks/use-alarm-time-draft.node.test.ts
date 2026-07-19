import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import type * as AlarmTimeDraft from "./use-alarm-time-draft";

const require = createRequire(import.meta.url);
const { toAlarmDraftTime, toReminderTime } = require(
  "./use-alarm-time-draft.ts",
) as typeof AlarmTimeDraft;

test("알림 시간은 기존 24시간 값을 선택기 초깃값으로 변환한다", () => {
  assert.deepEqual(toAlarmDraftTime(21, 5), {
    alarmPeriod: "오후",
    alarmHour: 9,
    alarmMinute: 5,
  });
});

test("자정과 정오는 올바른 24시간 알림 시간으로 저장한다", () => {
  assert.deepEqual(
    toReminderTime({ alarmPeriod: "오전", alarmHour: 12, alarmMinute: 0 }),
    { reminderHour: 0, reminderMinute: 0 },
  );
  assert.deepEqual(
    toReminderTime({ alarmPeriod: "오후", alarmHour: 12, alarmMinute: 30 }),
    { reminderHour: 12, reminderMinute: 30 },
  );
});

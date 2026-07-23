import { toAlarmDraftTime, toReminderTime } from "./use-alarm-time-draft";

test("알림 시간은 기존 24시간 값을 선택기 초깃값으로 변환한다", () => {
  expect(toAlarmDraftTime(21, 5)).toEqual({
    alarmPeriod: "오후",
    alarmHour: 9,
    alarmMinute: 5,
  });
});

test("자정과 정오는 올바른 24시간 알림 시간으로 저장한다", () => {
  expect(
    toReminderTime({ alarmPeriod: "오전", alarmHour: 12, alarmMinute: 0 }),
  ).toEqual({ reminderHour: 0, reminderMinute: 0 });
  expect(
    toReminderTime({ alarmPeriod: "오후", alarmHour: 12, alarmMinute: 30 }),
  ).toEqual({ reminderHour: 12, reminderMinute: 30 });
});

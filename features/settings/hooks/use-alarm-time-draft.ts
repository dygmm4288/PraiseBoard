import { useEffect, useMemo, useState } from "react";

export const ALARM_PERIODS = ["오전", "오후"] as const;
export const ALARM_HOURS = Array.from({ length: 12 }, (_, index) => index + 1);
export const ALARM_MINUTES = Array.from({ length: 60 }, (_, index) => index);

export type AlarmPeriod = (typeof ALARM_PERIODS)[number];

export const toAlarmDraftTime = (
  reminderHour: number | null | undefined,
  reminderMinute: number | null | undefined,
) => {
  const hour24 = reminderHour ?? 21;
  const minute = reminderMinute ?? 0;
  const period: AlarmPeriod = hour24 >= 12 ? "오후" : "오전";
  const hour12 = hour24 % 12 || 12;

  return {
    alarmPeriod: period,
    alarmHour: hour12,
    alarmMinute: minute,
  };
};

export const toReminderTime = ({
  alarmPeriod,
  alarmHour,
  alarmMinute,
}: {
  alarmPeriod: AlarmPeriod;
  alarmHour: number;
  alarmMinute: number;
}) => {
  const hour = alarmHour % 12;

  return {
    reminderHour: alarmPeriod === "오후" ? hour + 12 : hour,
    reminderMinute: alarmMinute,
  };
};

export const useAlarmTimeDraft = ({
  initialHour,
  initialMinute,
}: {
  initialHour?: number | null;
  initialMinute?: number | null;
} = {}) => {
  const initialTime = toAlarmDraftTime(initialHour, initialMinute);
  const [alarmPeriod, setAlarmPeriod] = useState<AlarmPeriod>(
    initialTime.alarmPeriod,
  );
  const [alarmHour, setAlarmHour] = useState(initialTime.alarmHour);
  const [alarmMinute, setAlarmMinute] = useState(initialTime.alarmMinute);

  useEffect(() => {
    const nextTime = toAlarmDraftTime(initialHour, initialMinute);
    setAlarmPeriod(nextTime.alarmPeriod);
    setAlarmHour(nextTime.alarmHour);
    setAlarmMinute(nextTime.alarmMinute);
  }, [initialHour, initialMinute]);

  const alarmTimeLabel = useMemo(
    () =>
      `${alarmPeriod} ${alarmHour}:${String(alarmMinute).padStart(2, "0")}`,
    [alarmHour, alarmMinute, alarmPeriod],
  );

  return {
    alarmHour,
    alarmMinute,
    alarmPeriod,
    alarmTimeLabel,
    setAlarmHour,
    setAlarmMinute,
    setAlarmPeriod,
  };
};

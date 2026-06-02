import { useMemo, useState } from "react";

export const ALARM_PERIODS = ["오전", "오후"] as const;
export const ALARM_HOURS = [7, 8, 9, 10, 11] as const;
export const ALARM_MINUTES = [58, 59, 0, 1, 2] as const;

export type AlarmPeriod = (typeof ALARM_PERIODS)[number];

export const useAlarmTimeDraft = () => {
  const [alarmPeriod, setAlarmPeriod] = useState<AlarmPeriod>("오후");
  const [alarmHour, setAlarmHour] = useState(9);
  const [alarmMinute, setAlarmMinute] = useState(0);

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

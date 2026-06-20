import { useEffect, useState } from "react";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const TIMER_DELAY_BUFFER_MS = 1000;

const getKstDateParts = (date: Date) => {
  const kstDate = new Date(date.getTime() + KST_OFFSET_MS);

  return {
    year: kstDate.getUTCFullYear(),
    month: kstDate.getUTCMonth(),
    date: kstDate.getUTCDate(),
  };
};

const getKstTodayKey = () => {
  const { year, month, date } = getKstDateParts(new Date());

  return [
    year,
    String(month + 1).padStart(2, "0"),
    String(date).padStart(2, "0"),
  ].join("-");
};

const getMsUntilNextKstDate = () => {
  const now = new Date();
  const { year, month, date } = getKstDateParts(now);
  const nextKstMidnightUtcMs =
    Date.UTC(year, month, date + 1) - KST_OFFSET_MS;

  return Math.max(
    TIMER_DELAY_BUFFER_MS,
    nextKstMidnightUtcMs - now.getTime() + TIMER_DELAY_BUFFER_MS,
  );
};

export const useTodayKey = () => {
  const [todayKey, setTodayKey] = useState(getKstTodayKey);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTodayKey(getKstTodayKey());
    }, getMsUntilNextKstDate());

    return () => clearTimeout(timeoutId);
  }, [todayKey]);

  return todayKey;
};

export default useTodayKey;

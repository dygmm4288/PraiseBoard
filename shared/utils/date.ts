export const extractDate = (date: Date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    day: date.getDay(),
  };
};

export const getLastDate = (date: Date) => {
  // 전달된 날짜가 포함된 달의 마지막 일을 반환한다.
  const { year, month } = extractDate(date);
  return new Date(year, month, 0).getDate();
};

export const getDateDiff = (source: Date, target: Date) => {
  const diffMs = target.getTime() - source.getTime();

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export const getCalendarDateDiff = (source: Date, target: Date) => {
  const sourceDate = new Date(
    source.getFullYear(),
    source.getMonth(),
    source.getDate(),
  );
  const targetDate = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );
  const diffMs = targetDate.getTime() - sourceDate.getTime();

  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

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

export const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const parseMonthKey = (month?: string | null) => {
  if (!month) return undefined;

  const [year, monthIndex] = month.split("-").map(Number);
  if (!year || !monthIndex) return undefined;

  return new Date(year, monthIndex - 1, 1);
};

export const getKstDateKey = (date = new Date()) => {
  const { year, month, date: day } = getKstDateParts(date);

  return [
    year,
    String(month + 1).padStart(2, "0"),
    String(day).padStart(2, "0"),
  ].join("-");
};

export const getMsUntilNextKstDate = (now = new Date()) => {
  const { year, month, date } = getKstDateParts(now);
  const nextKstMidnightUtcMs =
    Date.UTC(year, month, date + 1) - KST_OFFSET_MS;

  return Math.max(
    TIMER_DELAY_BUFFER_MS,
    nextKstMidnightUtcMs - now.getTime() + TIMER_DELAY_BUFFER_MS,
  );
};

export const getTodayRange = (now = new Date()) => {
  const { year, month, date } = getKstDateParts(now);
  const start = new Date(
    Date.UTC(year, month, date, -9, 0, 0),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    start,
    end,
  };
};

export const getMonthDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatShortDate = (dateValue?: string | null, fallback = "") => {
  if (!dateValue) return fallback;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return fallback;

  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export const formatKoreanMonthDay = (
  dateValue?: string | null,
  fallback = "",
) => {
  if (!dateValue) return fallback;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return fallback;

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default {
  getLastDate,
  extractDate,
  getDateDiff,
  getCalendarDateDiff,
  formatMonthKey,
  parseMonthKey,
  getKstDateKey,
  getMsUntilNextKstDate,
  getTodayRange,
  getMonthDate,
  addMonths,
  formatDateKey,
  formatShortDate,
  formatKoreanMonthDay,
};

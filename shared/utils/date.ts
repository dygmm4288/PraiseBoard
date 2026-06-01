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

export const getTodayRange = () => {
  const now = new Date();
  const start = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), -9, 0, 0),
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    start,
    end,
  };
};

export default {
  getLastDate,
  extractDate,
  getDateDiff,
  getCalendarDateDiff,
  getTodayRange,
};

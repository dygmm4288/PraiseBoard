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

export default {
  getLastDate,
  extractDate,
};

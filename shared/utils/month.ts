export type MonthRange = {
  startDate: string;
  endDate: string;
};

export const getMonthRange = (month: string): MonthRange => {
  const [year, monthIndex] = month.split("-").map(Number);

  if (!year || !monthIndex || monthIndex < 1 || monthIndex > 12) {
    throw new Error("month must be formatted as YYYY-MM");
  }

  const start = new Date(Date.UTC(year, monthIndex - 1, 1));
  const end = new Date(Date.UTC(year, monthIndex, 1));

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

export default {
  getMonthRange,
};

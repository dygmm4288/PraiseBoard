import { getCalendarDateDiff, getLastDate, getTodayRange } from "./date";

test("getLastDate returns 31 for a 31-day month", () => {
  expect(getLastDate(new Date(2026, 0, 10))).toBe(31);
});

test("getLastDate returns 30 for a 30-day month", () => {
  expect(getLastDate(new Date(2026, 3, 10))).toBe(30);
});

test("getLastDate returns 29 for leap-year February", () => {
  expect(getLastDate(new Date(2024, 1, 10))).toBe(29);
});

test("getLastDate returns 28 for non-leap-year February", () => {
  expect(getLastDate(new Date(2025, 1, 10))).toBe(28);
});

test("getCalendarDateDiff returns 0 for the same calendar date", () => {
  expect(
    getCalendarDateDiff(
      new Date(2026, 4, 16, 1, 0, 0),
      new Date(2026, 4, 16, 23, 0, 0),
    ),
  ).toBe(0);
});

test("getCalendarDateDiff returns elapsed calendar days", () => {
  expect(
    getCalendarDateDiff(new Date(2026, 3, 30), new Date(2026, 4, 5)),
  ).toBe(5);
});

test("getTodayRange returns the KST calendar day regardless of local timezone", () => {
  const { start, end } = getTodayRange(new Date("2026-06-27T16:30:00.000Z"));

  expect(start.toISOString()).toBe("2026-06-27T15:00:00.000Z");
  expect(end.toISOString()).toBe("2026-06-28T15:00:00.000Z");
});

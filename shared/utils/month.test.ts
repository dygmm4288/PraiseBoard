import { getMonthRange } from "./month";

test("getMonthRange returns inclusive start and exclusive end dates", () => {
  expect(getMonthRange("2026-05")).toEqual({
    startDate: "2026-05-01",
    endDate: "2026-06-01",
  });
});

test("getMonthRange handles December year rollover", () => {
  expect(getMonthRange("2026-12")).toEqual({
    startDate: "2026-12-01",
    endDate: "2027-01-01",
  });
});

test("getMonthRange rejects invalid month input", () => {
  expect(() => getMonthRange("2026-13")).toThrow(
    "month must be formatted as YYYY-MM",
  );
});

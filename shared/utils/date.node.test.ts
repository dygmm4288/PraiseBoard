import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import type * as DateUtils from "./date";

const require = createRequire(import.meta.url);
const { getCalendarDateDiff, getLastDate } = require("./date.ts") as typeof DateUtils;

test("getLastDate returns 31 for a 31-day month", () => {
  assert.equal(getLastDate(new Date(2026, 0, 10)), 31);
});

test("getLastDate returns 30 for a 30-day month", () => {
  assert.equal(getLastDate(new Date(2026, 3, 10)), 30);
});

test("getLastDate returns 29 for leap-year February", () => {
  assert.equal(getLastDate(new Date(2024, 1, 10)), 29);
});

test("getLastDate returns 28 for non-leap-year February", () => {
  assert.equal(getLastDate(new Date(2025, 1, 10)), 28);
});

test("getCalendarDateDiff returns 0 for the same calendar date", () => {
  assert.equal(
    getCalendarDateDiff(
      new Date(2026, 4, 16, 1, 0, 0),
      new Date(2026, 4, 16, 23, 0, 0),
    ),
    0,
  );
});

test("getCalendarDateDiff returns elapsed calendar days", () => {
  assert.equal(
    getCalendarDateDiff(new Date(2026, 3, 30), new Date(2026, 4, 5)),
    5,
  );
});

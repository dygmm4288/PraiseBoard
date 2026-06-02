import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import type * as MonthUtils from "./month";

const require = createRequire(import.meta.url);
const { getMonthRange } = require("./month.ts") as typeof MonthUtils;

test("getMonthRange returns inclusive start and exclusive end dates", () => {
  assert.deepEqual(getMonthRange("2026-05"), {
    startDate: "2026-05-01",
    endDate: "2026-06-01",
  });
});

test("getMonthRange handles December year rollover", () => {
  assert.deepEqual(getMonthRange("2026-12"), {
    startDate: "2026-12-01",
    endDate: "2027-01-01",
  });
});

test("getMonthRange rejects invalid month input", () => {
  assert.throws(() => getMonthRange("2026-13"), {
    message: "month must be formatted as YYYY-MM",
  });
});

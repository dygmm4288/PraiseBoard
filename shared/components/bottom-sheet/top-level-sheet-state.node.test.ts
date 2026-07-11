import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import type * as TopLevelSheetState from "./top-level-sheet-state";

const require = createRequire(import.meta.url);
const {
  clearTopLevelSheetState,
  getClosedSheetState,
  presentTopLevelSheetState,
  requestDismissTopLevelSheetState,
  updateTopLevelSheetIndexState,
} = require("./top-level-sheet-state.ts") as typeof TopLevelSheetState;

type TopLevelSheetConfig = TopLevelSheetState.TopLevelSheetConfig;

const createConfig = (
  overrides: Partial<TopLevelSheetConfig> = {},
): TopLevelSheetConfig => ({
  children: null,
  snapPoints: ["40%", "90%"],
  ...overrides,
});

test("present from closed state uses initialIndex", () => {
  const state = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig({ initialIndex: 1 }),
  );

  assert.equal(state.index, 1);
  assert.equal(state.presentationId, 1);
});

test("new present does not inherit the previous sheet index", () => {
  const first = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig({ initialIndex: 1 }),
  );
  const second = presentTopLevelSheetState(
    first,
    createConfig({ snapPoints: ["30%", "60%", "90%"], initialIndex: 0 }),
  );

  assert.equal(second.index, 0);
  assert.equal(second.presentationId, 2);
});

test("present with empty snapPoints keeps the sheet closed", () => {
  const current = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig({ initialIndex: 1 }),
  );
  const state = presentTopLevelSheetState(
    current,
    createConfig({ snapPoints: [] }),
  );

  assert.equal(state.config, null);
  assert.equal(state.index, -1);
  assert.equal(state.presentationId, current.presentationId);
});

test("dismiss requests index -1 and marks onClose to run", () => {
  const current = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig(),
  );
  const state = requestDismissTopLevelSheetState(current);

  assert.equal(state.index, -1);
  assert.equal(state.runOnCloseAfterDismiss, true);
});

test("onChange(-1) clears config after a user-driven close", () => {
  const current = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig(),
  );
  const state = clearTopLevelSheetState(current, true);

  assert.equal(state.config, null);
  assert.equal(state.index, -1);
});

test("onClose effect is captured exactly once on close", () => {
  let closeCount = 0;
  const onClose = () => {
    closeCount += 1;
  };
  const current = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig({ onClose }),
  );
  const closing = requestDismissTopLevelSheetState(current);
  const closed = clearTopLevelSheetState(closing, true);
  const closedAgain = clearTopLevelSheetState(closed, true);

  closed.closeEffect?.();

  assert.equal(closeCount, 1);
  assert.equal(closedAgain, closed);
});

test("index updates are ignored when outside current snapPoints", () => {
  const current = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig(),
  );

  assert.equal(updateTopLevelSheetIndexState(current, 1).index, 1);
  assert.equal(updateTopLevelSheetIndexState(current, 2), current);
  assert.equal(updateTopLevelSheetIndexState(current, -1), current);
});

test("consecutive dismiss requests do not create duplicate callbacks", () => {
  const onClose = () => {};
  const current = presentTopLevelSheetState(
    getClosedSheetState(),
    createConfig({ onClose }),
  );
  const firstDismiss = requestDismissTopLevelSheetState(current);
  const secondDismiss = requestDismissTopLevelSheetState(firstDismiss);
  const closed = clearTopLevelSheetState(secondDismiss, true);
  const closedAgain = clearTopLevelSheetState(closed, true);

  assert.equal(closed.closeEffect, onClose);
  assert.equal(closedAgain.config, null);
  assert.equal(closedAgain.closeEffect, closed.closeEffect);
});

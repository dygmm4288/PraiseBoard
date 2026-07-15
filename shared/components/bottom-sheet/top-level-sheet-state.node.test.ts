import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import type * as TopLevelSheetState from "./top-level-sheet-state";

const require = createRequire(import.meta.url);
const { getDismissalResult, getSafeInitialIndex, hasSnapPoints } =
  require("./top-level-sheet-state.ts") as typeof TopLevelSheetState;

type TopLevelSheetConfig = TopLevelSheetState.TopLevelSheetConfig;
type TopLevelSheetPresentation = TopLevelSheetState.TopLevelSheetPresentation;

const createConfig = (
  overrides: Partial<TopLevelSheetConfig> = {},
): TopLevelSheetConfig => ({
  children: null,
  snapPoints: ["40%", "90%"],
  ...overrides,
});

test("empty snapPoints are rejected before presentation", () => {
  assert.equal(hasSnapPoints(createConfig({ snapPoints: [] })), false);
  assert.equal(hasSnapPoints(createConfig()), true);
});

test("initialIndex is clamped to the available snap points", () => {
  assert.equal(getSafeInitialIndex(createConfig({ initialIndex: 1 })), 1);
  assert.equal(getSafeInitialIndex(createConfig({ initialIndex: -1 })), 0);
  assert.equal(getSafeInitialIndex(createConfig({ initialIndex: 4 })), 1);
  assert.equal(getSafeInitialIndex(createConfig({ initialIndex: 0.5 })), 0);
});

test("a stale dismiss cannot remove the replacement presentation", () => {
  const presentationA: TopLevelSheetPresentation = {
    id: 1,
    config: createConfig(),
  };
  const presentationB: TopLevelSheetPresentation = {
    id: 2,
    config: createConfig(),
  };

  const replacement = getDismissalResult(
    presentationA,
    presentationB,
    presentationA.id,
  );
  const staleDismiss = getDismissalResult(
    presentationB,
    null,
    presentationA.id,
  );

  assert.equal(replacement?.nextPresentation, presentationB);
  assert.equal(staleDismiss, null);
});

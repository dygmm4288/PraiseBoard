import {
  getDismissalResult,
  getSafeInitialIndex,
  hasSnapPoints,
  type TopLevelSheetConfig,
  type TopLevelSheetPresentation,
} from "./top-level-sheet-state";

const createConfig = (
  overrides: Partial<TopLevelSheetConfig> = {},
): TopLevelSheetConfig => ({
  children: null,
  snapPoints: ["40%", "90%"],
  ...overrides,
});

test("empty snapPoints are rejected before presentation", () => {
  expect(hasSnapPoints(createConfig({ snapPoints: [] }))).toBe(false);
  expect(hasSnapPoints(createConfig())).toBe(true);
});

test("initialIndex is clamped to the available snap points", () => {
  expect(getSafeInitialIndex(createConfig({ initialIndex: 1 }))).toBe(1);
  expect(getSafeInitialIndex(createConfig({ initialIndex: -1 }))).toBe(0);
  expect(getSafeInitialIndex(createConfig({ initialIndex: 4 }))).toBe(1);
  expect(getSafeInitialIndex(createConfig({ initialIndex: 0.5 }))).toBe(0);
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

  expect(replacement?.nextPresentation).toBe(presentationB);
  expect(staleDismiss).toBeNull();
});

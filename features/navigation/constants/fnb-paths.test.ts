import {
  getFnbParentKey,
  isFnbRootPathname,
  isFnbVisiblePathname,
} from "./fnb-paths";

test("디버그 설정을 설정 탭의 하위 화면으로 처리한다", () => {
  expect(getFnbParentKey("/debug-settings")).toBe("setting");
  expect(isFnbRootPathname("/debug-settings")).toBe(false);
  expect(isFnbVisiblePathname("/debug-settings")).toBe(true);
});

test("기존 FNB 루트 화면은 계속 표시한다", () => {
  expect(isFnbVisiblePathname("/")).toBe(true);
  expect(isFnbVisiblePathname("/stats")).toBe(true);
  expect(isFnbVisiblePathname("/archives")).toBe(true);
  expect(isFnbVisiblePathname("/settings")).toBe(true);
});

test("FNB 대상이 아닌 화면은 표시하지 않는다", () => {
  expect(getFnbParentKey("/signup")).toBeNull();
  expect(isFnbVisiblePathname("/signup")).toBe(false);
});

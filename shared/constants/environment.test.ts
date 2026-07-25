import { resolveDebugEnabled } from "./environment";

test.each(["dev", "development", "preview"])(
  "%s 환경에서 명시적으로 켠 경우에만 debug 기능을 허용한다",
  (appEnvironment) => {
    expect(resolveDebugEnabled(appEnvironment, "true")).toBe(true);
    expect(resolveDebugEnabled(appEnvironment, "false")).toBe(false);
  },
);

test("production에서는 debug 설정값과 관계없이 비활성화한다", () => {
  expect(resolveDebugEnabled("production", "true")).toBe(false);
});

test("환경이 없거나 알 수 없는 값이면 안전하게 비활성화한다", () => {
  expect(resolveDebugEnabled(undefined, "true")).toBe(false);
  expect(resolveDebugEnabled("unknown", "true")).toBe(false);
});

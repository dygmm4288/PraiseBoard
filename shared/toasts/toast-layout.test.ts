import {
  resolveToastBottomOffset,
  TOAST_BOTTOM_GAP,
} from "./toast-layout";

describe("resolveToastBottomOffset", () => {
  it("키보드와 FNB가 없으면 safe area 위 16pt에 표시한다", () => {
    expect(
      resolveToastBottomOffset({ bottomSafeAreaInset: 34 }),
    ).toBe(34 + TOAST_BOTTOM_GAP);
  });

  it("FNB가 있으면 FNB 상단 위 16pt에 표시한다", () => {
    expect(
      resolveToastBottomOffset({
        bottomSafeAreaInset: 34,
        fnbClearance: 110,
      }),
    ).toBe(110 + TOAST_BOTTOM_GAP);
  });

  it("키보드가 노출되면 safe area와 키보드 높이 위 16pt에 표시한다", () => {
    expect(
      resolveToastBottomOffset({
        bottomSafeAreaInset: 34,
        fnbClearance: 110,
        keyboardHeight: 300,
      }),
    ).toBe(34 + 300 + TOAST_BOTTOM_GAP);
  });
});

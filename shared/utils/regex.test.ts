import { KOR_ENG_SYMBOL_SPACE_REGEX } from "./regex";

test("KOR_ENG_SYMBOL_SPACE_REGEX allows Korean, English, symbols, and spaces", () => {
  expect(KOR_ENG_SYMBOL_SPACE_REGEX.test("Praise Board! 칭찬해요 :)")).toBe(
    true,
  );
});

test("KOR_ENG_SYMBOL_SPACE_REGEX rejects digits", () => {
  expect(KOR_ENG_SYMBOL_SPACE_REGEX.test("Praise123")).toBe(false);
});

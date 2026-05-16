import assert from "node:assert/strict";
import test from "node:test";

import { KOR_ENG_SYMBOL_SPACE_REGEX } from "./regex";

test("KOR_ENG_SYMBOL_SPACE_REGEX allows Korean, English, symbols, and spaces", () => {
  assert.equal(KOR_ENG_SYMBOL_SPACE_REGEX.test("Praise Board! 칭찬해요 :)"), true);
});

test("KOR_ENG_SYMBOL_SPACE_REGEX rejects digits", () => {
  assert.equal(KOR_ENG_SYMBOL_SPACE_REGEX.test("Praise123"), false);
});

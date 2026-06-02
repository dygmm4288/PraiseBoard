import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

import type * as RegexUtils from "./regex";

const require = createRequire(import.meta.url);
const { KOR_ENG_SYMBOL_SPACE_REGEX } = require("./regex.ts") as typeof RegexUtils;

test("KOR_ENG_SYMBOL_SPACE_REGEX allows Korean, English, symbols, and spaces", () => {
  assert.equal(KOR_ENG_SYMBOL_SPACE_REGEX.test("Praise Board! 칭찬해요 :)"), true);
});

test("KOR_ENG_SYMBOL_SPACE_REGEX rejects digits", () => {
  assert.equal(KOR_ENG_SYMBOL_SPACE_REGEX.test("Praise123"), false);
});

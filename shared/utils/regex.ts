// shared/utils/regex.ts
export const KOREAN_CHAR_SOURCE = "가-힣ㄱ-ㅎㅏ-ㅣ";
export const ENGLISH_CHAR_SOURCE = "A-Za-z";
export const SPECIAL_CHAR_SOURCE = String.raw`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\`~`;
export const SPACE_CHAR_SOURCE = " ";

export const KOR_ENG_SYMBOL_SPACE_REGEX = new RegExp(
  `^[${KOREAN_CHAR_SOURCE}${ENGLISH_CHAR_SOURCE}${SPECIAL_CHAR_SOURCE}${SPACE_CHAR_SOURCE}]*$`,
);


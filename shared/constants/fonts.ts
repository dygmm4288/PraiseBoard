import type { TextStyle } from "react-native";

export const FONT_FAMILY = {
  regular: "Pretendard",
  medium: "Pretendard-Medium",
  semibold: "Pretendard-SemiBold",
  bold: "Pretendard-Bold",
} as const;

export const FONT_FAMILY_BY_WEIGHT: Record<
  keyof typeof FONT_FAMILY,
  TextStyle["fontFamily"]
> = FONT_FAMILY;

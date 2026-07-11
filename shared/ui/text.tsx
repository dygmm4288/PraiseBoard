import { cn } from "@/shared/utils/cn";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

type TextCoreVariant =
  | "title33"
  | "title26"
  | "title18"
  | "title16"
  | "body14"
  | "button15"
  | "label12"
  | "label10"
  | "label9"
  | "title1"
  | "title2"
  | "title3"
  | "body1"
  | "body2"
  | "body3"
  | "caption1"
  | "caption2"
  | "button1"
  | "button2"
  | "custom";

type TextAliasVariant = "title" | "body" | "caption" | "label";

export type TextVariant = TextCoreVariant | TextAliasVariant;
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export interface AppTextProps extends RNTextProps {
  className?: string;
  variant?: TextVariant;
  weight?: TextWeight;
}

export const TEXT_VARIANT_STYLES: Record<TextCoreVariant, string> = {
  title33: "text-title-33",
  title26: "text-title-26",
  title18: "text-title-18",
  title16: "text-title-16",
  body14: "text-body-14",
  button15: "text-button-15",
  label12: "text-label-12",
  label10: "text-label-10",
  label9: "text-label-9",
  title1: "text-title1",
  title2: "text-title2",
  title3: "text-title3",
  body1: "text-body1",
  body2: "text-body2",
  body3: "text-body3",
  caption1: "text-caption1",
  caption2: "text-caption2",
  button1: "text-button1",
  button2: "text-button2",
  custom: "",
};

export const TEXT_VARIANT_ALIASES: Record<TextAliasVariant, TextCoreVariant> = {
  title: "title2",
  body: "body2",
  caption: "caption1",
  label: "button1",
};

export const TEXT_WEIGHT_STYLES: Record<TextWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const TEXT_DEFAULT_WEIGHT_BY_VARIANT: Record<TextCoreVariant, TextWeight> = {
  title33: "bold",
  title26: "bold",
  title18: "bold",
  title16: "bold",
  body14: "regular",
  button15: "medium",
  label12: "regular",
  label10: "regular",
  label9: "semibold",
  title1: "bold",
  title2: "bold",
  title3: "bold",
  body1: "medium",
  body2: "regular",
  body3: "regular",
  caption1: "regular",
  caption2: "regular",
  button1: "semibold",
  button2: "regular",
  custom: "medium",
};

const resolveTextVariant = (variant: TextVariant): TextCoreVariant =>
  variant in TEXT_VARIANT_ALIASES
    ? TEXT_VARIANT_ALIASES[variant as TextAliasVariant]
    : (variant as TextCoreVariant);

export const AppText = ({
  className,
  variant = "body",
  weight,
  ...props
}: AppTextProps) => {
  const resolvedVariant = resolveTextVariant(variant);
  const resolvedWeight =
    weight ?? TEXT_DEFAULT_WEIGHT_BY_VARIANT[resolvedVariant];

  return (
    <RNText
      className={cn(
        "font-pretendard",
        TEXT_VARIANT_STYLES[resolvedVariant],
        TEXT_WEIGHT_STYLES[resolvedWeight],
        className,
      )}
      {...props}
    />
  );
};

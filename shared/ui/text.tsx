import { cn } from "@/shared/utils/cn";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

type TextCoreVariant =
  | "title1"
  | "title2"
  | "title3"
  | "body1"
  | "body2"
  | "body3"
  | "caption1"
  | "button1";

type TextAliasVariant = "title" | "body" | "caption" | "label";

export type TextVariant = TextCoreVariant | TextAliasVariant;
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

export interface AppTextProps extends RNTextProps {
  className?: string;
  variant?: TextVariant;
  weight?: TextWeight;
}

export const TEXT_VARIANT_STYLES: Record<TextCoreVariant, string> = {
  title1: "text-title1",
  title2: "text-title2",
  title3: "text-title3",
  body1: "text-body1",
  body2: "text-body2",
  body3: "text-body3",
  caption1: "text-caption1",
  button1: "text-button1",
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
  title1: "bold",
  title2: "bold",
  title3: "bold",
  body1: "medium",
  body2: "regular",
  body3: "regular",
  caption1: "regular",
  button1: "semibold",
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

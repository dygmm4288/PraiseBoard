import { cn } from "@/shared/lib/cn";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

type TextVariant = "display" | "title" | "body" | "caption" | "label";
type TextTone = "default" | "muted" | "primary" | "danger" | "inverse";
type TextWeight = "regular" | "medium" | "semibold" | "bold";

export interface AppTextProps extends RNTextProps {
  className?: string;
  variant?: TextVariant;
  tone?: TextTone;
  weight?: TextWeight;
}

export const TEXT_VARIANT_STYLES: Record<TextVariant, string> = {
  display: "text-3xl leading-9",
  title: "text-2xl leading-8",
  body: "text-base leading-6",
  caption: "text-sm leading-5",
  label: "text-sm leading-5",
};

export const TEXT_TONE_STYLES: Record<TextTone, string> = {
  default: "text-gray-900",
  muted: "text-gray-500",
  primary: "text-blue-600",
  danger: "text-red-600",
  inverse: "text-white",
};

export const TEXT_WEIGHT_STYLES: Record<TextWeight, string> = {
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export const AppText = ({
  className,
  variant = "body",
  tone = "default",
  weight,
  ...props
}: AppTextProps) => {
  const resolvedWeight =
    weight ??
    (variant === "display" || variant === "title" ? "bold" : "regular");

  return (
    <RNText
      className={cn(
        TEXT_VARIANT_STYLES[variant],
        TEXT_TONE_STYLES[tone],
        TEXT_WEIGHT_STYLES[resolvedWeight],
        className,
      )}
      {...props}
    />
  );
};

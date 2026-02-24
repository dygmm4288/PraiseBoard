import { cn } from "@/shared/lib/cn";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { AppText } from "./text";

type ButtonVariant = "solid" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface AppButtonProps extends TouchableOpacityProps {
  className?: string;
  textClassName?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  loading?: boolean;
  fullWidth?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const BUTTON_CONTAINER_STYLES: Record<ButtonVariant, string> = {
  solid: "bg-blue-500 border border-blue-500",
  secondary: "bg-gray-100 border border-gray-100",
  outline: "bg-white border border-gray-300",
  ghost: "bg-transparent border border-transparent",
  danger: "bg-red-500 border border-red-500",
};

export const BUTTON_TEXT_STYLES: Record<ButtonVariant, string> = {
  solid: "text-white",
  secondary: "text-gray-900",
  outline: "text-gray-900",
  ghost: "text-blue-600",
  danger: "text-white",
};

export const BUTTON_SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-2 rounded-lg",
  md: "min-h-12 px-4 py-3 rounded-xl",
  lg: "min-h-14 px-5 py-4 rounded-2xl",
};

export const AppButton = ({
  className,
  textClassName,
  variant = "solid",
  size = "md",
  label,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftSlot,
  rightSlot,
  children,
  activeOpacity = 0.85,
  ...props
}: AppButtonProps) => {
  const isDisabled = disabled || loading;
  const content =
    typeof children === "string" && !label ? (
      <AppText
        variant='label'
        weight='semibold'
        className={cn(BUTTON_TEXT_STYLES[variant], textClassName)}>
        {children}
      </AppText>
    ) : (
      children
    );

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      disabled={isDisabled}
      className={cn(
        "flex-row items-center justify-center gap-2",
        BUTTON_CONTAINER_STYLES[variant],
        BUTTON_SIZE_STYLES[size],
        fullWidth && "w-full",
        isDisabled && "opacity-50",
        className
      )}
      {...props}>
      {leftSlot ? <View>{leftSlot}</View> : null}

      {label ? (
        <AppText
          variant='label'
          weight='semibold'
          className={cn(BUTTON_TEXT_STYLES[variant], textClassName)}>
          {label}
        </AppText>
      ) : (
        content
      )}

      {loading ? (
        <ActivityIndicator
          size='small'
          color={variant === "secondary" || variant === "outline" ? "#111827" : "#ffffff"}
        />
      ) : rightSlot ? (
        <View>{rightSlot}</View>
      ) : null}
    </TouchableOpacity>
  );
};

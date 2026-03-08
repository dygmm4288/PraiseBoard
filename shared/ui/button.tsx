import { cn } from "@/shared/lib/cn";
import React from "react";
import { Pressable, PressableProps, View } from "react-native";
import { AppText } from "./text";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "sm" | "md" | "lg";
type ButtonState = "enabled" | "disabled";

export interface AppButtonProps extends Omit<PressableProps, "children"> {
  className?: string;
  textClassName?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  fullWidth?: boolean;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  children?: React.ReactNode;
}

export const BUTTON_CONTAINER_STYLES: Record<
  ButtonVariant,
  Record<ButtonState, string>
> = {
  primary: {
    enabled: "bg-primary-500 border border-primary-500",
    disabled: "bg-gray-100 border border-gray-100",
  },
  secondary: {
    enabled: "bg-primary-100 border border-primary-100",
    disabled: "", // TODO
  },
  tertiary: {
    enabled: "bg-white border border-gray-200",
    disabled: "", // TODO
  },
};

export const BUTTON_TEXT_STYLES: Record<
  ButtonVariant,
  Record<ButtonState, string>
> = {
  primary: {
    enabled: "text-white",
    disabled: "text-gray-300",
  },
  secondary: {
    enabled: "text-primary-700",
    disabled: "", // TODO
  },
  tertiary: {
    enabled: "text-gray-700",
    disabled: "", // TODO
  },
};

export const BUTTON_SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-2 rounded-lg", // TODO
  md: "min-h-[56px] px-[20px] py-[15px] rounded-[14px]",
  lg: "min-h-14 px-5 py-4 rounded-2xl", // TODO
};

export const AppButton = ({
  className,
  textClassName,
  variant = "primary",
  size = "md",
  label,
  disabled = false,
  fullWidth = false,
  leftSlot,
  rightSlot,
  children,
  ...props
}: AppButtonProps) => {
  const isDisabled = !!disabled;
  const state = isDisabled ? "disabled" : "enabled";
  const content =
    typeof children === "string" && !label ? (
      <AppText
        variant="button1"
        weight="semibold"
        className={cn(BUTTON_TEXT_STYLES[variant][state], textClassName)}
      >
        {children}
      </AppText>
    ) : (
      children
    );

  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        "flex-row items-center justify-center gap-2",
        BUTTON_CONTAINER_STYLES[variant][state],
        BUTTON_SIZE_STYLES[size],
        fullWidth && "w-full",
        isDisabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {leftSlot ? <View>{leftSlot}</View> : null}

      {label ? (
        <AppText
          variant="button1"
          weight="semibold"
          className={cn(BUTTON_TEXT_STYLES[variant][state], textClassName)}
        >
          {label}
        </AppText>
      ) : (
        content
      )}

      {rightSlot && <View>{rightSlot}</View>}
    </Pressable>
  );
};

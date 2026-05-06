import { cn } from "@/shared/utils/cn";
import { Pressable, PressableProps } from "react-native";
import { AppText } from "./text";

export type SelectableOptionProps<T = string> = {
  label: string;
  value?: T;
  selected?: boolean;
  className?: string;
  textClassName?: string;
  onSelect?: (value: T) => void;
} & Omit<PressableProps, "children">;

export function SelectableOption<T = string>({
  label,
  value,
  selected = false,
  disabled = false,
  className,
  textClassName,
  ...props
}: SelectableOptionProps<T>) {
  const isDisabled = !!disabled;

  return (
    <Pressable
      {...props}
      onPress={(e) => {
        props.onPress?.(e);
        props.onSelect?.((value ?? label) as T);
      }}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: isDisabled }}
      className={cn(
        "h-[38px] min-w-0 flex-1 items-center justify-center rounded-[10px] border px-[12px] py-[6px]",
        selected
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 bg-white",
        isDisabled && "opacity-50",
        className,
      )}
    >
      <AppText
        variant="body3"
        className={cn(
          "text-center text-[14px] leading-[20px]",
          selected ? "text-primary-500" : "text-gray-400",
          textClassName,
        )}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export default SelectableOption;

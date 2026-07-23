import { Icon } from "@/assets/icons";
import { useState } from "react";
import { Pressable } from "react-native";
import { COLORS } from "@/shared/theme";

type Props = {
  onPress: () => void;
  disabled: boolean;
  variant?: "default" | "todayDone" | "completed";
  testID?: string;
  accessibilityLabel?: string;
};

const AppCheckbox = ({
  onPress,
  disabled,
  variant = "default",
  testID,
  accessibilityLabel,
}: Props) => {
  // TODO(theme): Move todayDone/completed color ownership with the feature-state
  // mapping when this board-specific component boundary is addressed.
  const [isHovered, setIsHovered] = useState(false);
  const isInteractiveHover = !disabled && isHovered;
  const isCompleted = variant === "completed";
  const isTodayDone = variant === "todayDone";
  const checkColor = isCompleted
    ? COLORS.secondary[50]
    : isTodayDone
      ? COLORS.primary[50]
      : disabled
        ? COLORS.content.disabled
        : isInteractiveHover
          ? COLORS.primary[70]
          : COLORS.primary[50];

  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: isTodayDone || isCompleted, disabled }}
      onPress={onPress}
      disabled={disabled || isTodayDone || isCompleted}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      className={[
        "h-[33px] w-[33px] items-center justify-center rounded-[9px] border",
        isCompleted
          ? "border-secondary-30 bg-secondary-20"
          : isTodayDone
            ? "border-primary-20 bg-primary-10"
            : disabled
              ? "border-neutral-300 bg-neutral-100"
              : [
                  "border-primary-500",
                  isInteractiveHover ? "bg-primary-100" : "bg-white",
                ].join(" "),
      ].join(" ")}
    >
      <Icon name="Check" size={18} color={checkColor} />
    </Pressable>
  );
};

export default AppCheckbox;

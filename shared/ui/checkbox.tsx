import { Icon } from "@/assets/icons";
import { useState } from "react";
import { Pressable } from "react-native";
import { COLOR } from "../constants/colors.constant";

type Props = {
  onPress: () => void;
  disabled: boolean;
  variant?: "default" | "todayDone" | "completed";
};

const AppCheckbox = ({ onPress, disabled, variant = "default" }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const isInteractiveHover = !disabled && isHovered;
  const isCompleted = variant === "completed";
  const isTodayDone = variant === "todayDone";
  const checkColor = isCompleted
    ? COLOR.secondary50
    : isTodayDone
      ? COLOR.primary50
      : disabled
        ? COLOR.textGray
        : isInteractiveHover
          ? COLOR.primary70
          : COLOR.primary50;

  return (
    <Pressable
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
              ? "border-gray-300 bg-gray-100"
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

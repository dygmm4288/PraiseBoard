import { useState } from "react";
import { Pressable } from "react-native";
import { AppText } from "./text";

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

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isTodayDone || isCompleted}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      className={[
        "h-[34px] w-[34px] items-center justify-center rounded-[9px] border-[1.5px]",
        isCompleted
          ? "border-[#FBE5C7] bg-[#FFF6DD]"
          : isTodayDone
          ? "border-[#BBA6EE] bg-[#F1ECFC]"
          : disabled
          ? "border-gray-300 bg-gray-100"
          : [
              "border-primary-500",
              isInteractiveHover ? "bg-primary-100" : "bg-transparent",
            ].join(" "),
      ].join(" ")}
    >
      <AppText
        weight="semibold"
        className={[
          "text-[15px] leading-[15px]",
          isCompleted
            ? "text-[#C8920A]"
            : isTodayDone
            ? "text-[#7F5ADD]"
            : disabled
            ? "text-gray-300"
            : isInteractiveHover
              ? "text-primary-700"
              : "text-primary-500",
        ].join(" ")}
      >
        ✓
      </AppText>
    </Pressable>
  );
};

export default AppCheckbox;

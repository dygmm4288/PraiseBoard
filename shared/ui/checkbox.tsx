import { useState } from "react";
import { Pressable } from "react-native";
import { AppText } from "./text";

type Props = {
  onPress: () => void;
  disabled: boolean;
};

const AppCheckbox = ({ onPress, disabled }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const isInteractiveHover = !disabled && isHovered;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      className={[
        "h-[34px] w-[34px] items-center justify-center rounded-[9px] border-[1.5px]",
        disabled
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
          disabled
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

import React from "react";
import { View } from "react-native";
import { cn } from "../utils/cn";
import { AppText } from "./text";

type ScreenHeaderProps = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
};

const ScreenHeader = ({
  title,
  left,
  right,
  align = "left",
  className,
  titleClassName,
}: ScreenHeaderProps) => {
  const isCentered = align === "center";

  return (
    <View
      className={cn(
        "flex h-[45px] w-full flex-row items-center px-[8px]",
        isCentered && "justify-between",
        className,
      )}
    >
      {(isCentered || left) && (
        <View
          className={cn(
            isCentered && "min-w-[39px]",
            Boolean(left) && !isCentered && "mr-[8px]",
          )}
        >
          {left}
        </View>
      )}
      <View className={cn("flex-1", isCentered && "items-center")}>
        {title && (
          <AppText
            variant="custom"
            weight="bold"
            className={cn(
              "text-[18px] leading-[32px] tracking-[-0.18px] text-gray-900",
              isCentered ? "text-center" : "text-left",
              titleClassName,
            )}
          >
            {title}
          </AppText>
        )}
      </View>
      {(isCentered || right) && (
        <View
          className={cn(
            isCentered && "min-w-[39px]",
            Boolean(right) && !isCentered && "ml-[8px]",
          )}
        >
          {right}
        </View>
      )}
    </View>
  );
};

export default ScreenHeader;

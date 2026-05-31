import React from "react";
import { View } from "react-native";
import { cn } from "../utils/cn";
import { AppText } from "./text";

type ScreenHeaderProps = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

const ScreenHeader = ({ title, left, right, className }: ScreenHeaderProps) => {
  return (
    <View
      className={cn(
        "flex h-[45px] w-full flex-row items-center px-[8px]",
        className,
      )}
    >
      {left && <View className="mr-[8px]">{left}</View>}
      <View className="flex-1">
        {title && (
          <AppText variant="button1" className="text-gray-850 text-left">
            {title}
          </AppText>
        )}
      </View>
      {right && <View className="ml-[8px]">{right}</View>}
    </View>
  );
};

export default ScreenHeader;

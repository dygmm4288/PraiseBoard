import React from "react";
import { View } from "react-native";
import { cn } from "../utils/cn";
import { AppText } from "./text";

type ScreenHeaderProps = {
  title?: string;
  className?: string;
};

const ScreenHeader = ({ title, className }: ScreenHeaderProps) => {
  return (
    <View className={cn("flex flex-row h-[45px] px-[8px] w-full", className)}>
      <View className="flex-1">
        {title && (
          <AppText variant="button1" className="text-gray-850 text-left">
            {title}
          </AppText>
        )}
      </View>
    </View>
  );
};

export default ScreenHeader;

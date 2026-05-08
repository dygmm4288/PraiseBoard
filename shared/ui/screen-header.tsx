import React from "react";
import { View } from "react-native";
import { AppText } from "./text";

type ScreenHeaderProps = {
  title?: string;
};

const ScreenHeader = ({ title }: ScreenHeaderProps) => {
  return (
    <View className="flex flex-row h-[45px] px-[24px] w-full">
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

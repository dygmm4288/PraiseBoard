import React from "react";
import { View } from "react-native";
import { AppText } from "./text";

type ScreenHeaderProps = {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const ScreenHeader = ({ title, left, right }: ScreenHeaderProps) => {
  return (
    <View className="flex flex-row justify-between items-center h-[24px] py-[20px] w-full">
      <View className="w-min-[24px] h-[24px]">{left}</View>
      <View className="flex-1">
        {title && (
          <AppText variant="button1" className="text-gray-700 text-center">
            {title}
          </AppText>
        )}
      </View>
      <View className="w-min-[24px] h-[24px]">{right}</View>
    </View>
  );
};

export default ScreenHeader;

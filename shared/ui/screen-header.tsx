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
    <View className="flex flex-row justify-between items-center h-[24px]">
      {/* Left 없을 경우 dummy data */}
      {left || <View className="w-[24px] h-[24px]"></View>}
      {title && (
        <AppText variant="button1" className="text-gray-700 flex-1 text-center">
          {title}
        </AppText>
      )}
      {/* Right 없을 경우 dummy data */}
      {right || <View className="w-[24px] h-[24px]"></View>}
    </View>
  );
};

export default ScreenHeader;

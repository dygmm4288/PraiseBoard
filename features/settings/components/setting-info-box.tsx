import { AppText } from "@/shared/ui";
import { PropsWithChildren } from "react";
import { View } from "react-native";

type SettingInfoProps = {
  right?: string;
} & PropsWithChildren;
const SettingInfoBox = ({ right, children }: SettingInfoProps) => {
  return (
    <View className="flex flex-row justify-between items-center px-[12px] py-[10px] rounded-[10px] ">
      <AppText variant="body3" className="text-gray-500 flex-shrink">
        {children}
      </AppText>
      <View className="flex flex-row gap-[10px]">
        {right && (
          <AppText variant="body3" className="text-gray-500">
            {right}
          </AppText>
        )}
      </View>
    </View>
  );
};

export default SettingInfoBox;

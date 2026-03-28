import { AppText } from "@/shared/ui";
import { PropsWithChildren } from "react";
import { View } from "react-native";

type Props = {
  title?: string;
  bottomBorderYn?: boolean;
} & PropsWithChildren;

const SettingSectionLayout = ({
  title,
  children,
  bottomBorderYn = true,
}: Props) => {
  return (
    <View className="flex flex-col gap-[10px] pb-[24px] border-b-gray-300 border-solid border-b">
      {title && (
        <AppText variant="caption1" className="text-gray-400">
          {title}
        </AppText>
      )}

      {children}
    </View>
  );
};

export default SettingSectionLayout;

import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
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
  const bottomBorderClass = bottomBorderYn ? 'border-b-gray-300 border-solid border-b' : '';
  return (
    <View className={cn("flex flex-col gap-[10px] pb-[24px]", bottomBorderClass)}>
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

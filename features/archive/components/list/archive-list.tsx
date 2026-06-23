import { AppText } from "@/shared/ui";
import { Children } from "react";
import type { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  title: string;
  action?: ReactNode;
  emptyMessage?: string;
  children: ReactNode;
};

const ArchiveSection = ({ title, action, emptyMessage, children }: Props) => {
  const isEmpty = Children.count(children) === 0;

  return (
    <View className="flex flex-col gap-[12px]">
      <View className="flex flex-row justify-between">
        <AppText variant="caption1" weight="semibold">
          {title}
        </AppText>
        {action}
      </View>
      {isEmpty && emptyMessage ? (
        <View className="h-[85px] items-center justify-center rounded-[20px] border border-dashed border-line bg-white px-[16px]">
          <AppText variant="body3" className="text-center text-gray-300">
            {emptyMessage}
          </AppText>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

export default ArchiveSection;

import { AppText } from "@/shared/ui";
import { View } from "react-native";

type Props = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

const ArchiveSection = ({ title, action, children }: Props) => {
  return (
    <View className="flex flex-col gap-[12px]">
      <View className="flex flex-row justify-between">
        <AppText variant="caption1" weight="semibold">
          {title}
        </AppText>
        {action}
      </View>
      {children}
    </View>
  );
};

export default ArchiveSection;

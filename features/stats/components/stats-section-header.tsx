import { AppText } from "@/shared/ui";
import { View } from "react-native";

type Props = {
  label: string;
  value: string;
};

const StatsSectionHeader = ({ label, value }: Props) => {
  return (
    <View className="flex-row items-center justify-between">
      <AppText variant="caption1" weight="semibold" className="text-labelGray">
        {label}
      </AppText>
      <AppText variant="title3" weight="bold" className="text-primary-500">
        {value}
      </AppText>
    </View>
  );
};

export default StatsSectionHeader;

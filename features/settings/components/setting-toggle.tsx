import { AppText, Toggle } from "@/shared/ui";
import { View } from "react-native";

type SettingToggleProps = {
  label: string;
  value: boolean;
  disabled: boolean;
  onToggle: (nextValue: boolean) => Promise<void>;
};
const SettingToggle = ({
  label,
  value,
  disabled,
  onToggle,
}: SettingToggleProps) => {
  return (
    <View className="flex flex-row justify-between w-full flex-grow" >
      <AppText variant="body2" className="text-gray-700">
        {label}
      </AppText>
      <Toggle
        value={value}
        disabled={disabled}
        accessibilityLabel={label}
        onValueChange={onToggle}
      />
    </View>
  );
};

export default SettingToggle;

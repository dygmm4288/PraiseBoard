import { AppText, Toggle } from "@/shared/ui";
import { ReactNode } from "react";
import { Pressable, View } from "react-native";

type SettingToggleProps = {
  label: string;
  description?: string;
  accessory?: ReactNode;
  value: boolean;
  disabled: boolean;
  onToggle: (nextValue: boolean) => Promise<void>;
};
const SettingToggle = ({
  label,
  description,
  accessory,
  value,
  disabled,
  onToggle,
}: SettingToggleProps) => {
  return (
    <View className="w-full flex-row items-center justify-between gap-[16px] px-[20px]">
      <Pressable
        className="min-w-0 flex-1 gap-[3px]"
        disabled={disabled}
        onPress={() => onToggle(!value)}
      >
        <AppText
          variant="custom"
          className="text-[14px] leading-[20px] text-[#1C1B1F]"
          numberOfLines={1}
        >
          {label}
        </AppText>
        {description && (
          <AppText
            variant="custom"
            className="text-[12px] leading-[20px] text-[#8E8E95]"
          >
            {description}
          </AppText>
        )}
        {accessory}
      </Pressable>
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

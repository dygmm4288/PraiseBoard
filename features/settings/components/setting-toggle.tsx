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
      <View className="min-w-0 flex-1 gap-[3px]">
        <Pressable
          disabled={disabled}
          onPress={() => onToggle(!value)}
        >
          <AppText
            variant="body14"
            className="text-black"
            numberOfLines={1}
          >
            {label}
          </AppText>
          {description && (
            <AppText
              variant="label12"
              className="text-labelGray"
            >
              {description}
            </AppText>
          )}
        </Pressable>
        {accessory}
      </View>
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

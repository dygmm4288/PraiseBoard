import { AppText } from "@/shared/ui";
import { Pressable, View } from "react-native";

const SheetIconButton = ({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: "neutral" | "primary";
  onPress: () => void;
}) => {
  return (
    <Pressable
      accessibilityRole="button"
      className={[
        "h-[39px] w-[39px] items-center justify-center rounded-full",
        variant === "primary" ? "bg-primary-10" : "bg-bgLightGray",
      ].join(" ")}
      onPress={onPress}
    >
      <AppText
        variant="custom"
        weight="medium"
        className={[
          "text-[22px] leading-[24px]",
          variant === "primary" ? "text-primary-50" : "text-black",
        ].join(" ")}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const SettingsSheetHeader = ({
  title,
  onClose,
  onConfirm,
}: {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <View className="h-[45px] flex-row items-center justify-between px-[24px]">
      <SheetIconButton label="×" variant="neutral" onPress={onClose} />
      <AppText
        variant="custom"
        weight="bold"
        className="text-[18px] leading-[32px] text-black"
      >
        {title}
      </AppText>
      <SheetIconButton label="✓" variant="primary" onPress={onConfirm} />
    </View>
  );
};

export default SettingsSheetHeader;

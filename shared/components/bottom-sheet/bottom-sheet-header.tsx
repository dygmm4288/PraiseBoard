import { Icon } from "@/assets/icons";
import { COLOR } from "@/shared/constants/colors.constant";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { Pressable, View } from "react-native";

type HeaderButtonProps = {
  variant: "close" | "confirm";
  disabled?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
};

type BottomSheetHeaderProps = {
  title: string;
  confirmDisabled?: boolean;
  className?: string;
  closeAccessibilityLabel?: string;
  confirmAccessibilityLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
};

const HeaderButton = ({
  variant,
  disabled,
  accessibilityLabel,
  onPress,
}: HeaderButtonProps) => {
  const isConfirm = variant === "confirm";
  const activeConfirm = isConfirm && !disabled;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      className={cn(
        "h-[39px] w-[39px] items-center justify-center rounded-full",
        activeConfirm ? "bg-primary-10" : "bg-bgLightGray",
        disabled && "opacity-60",
      )}
      onPress={onPress}
    >
      <Icon
        name={isConfirm ? "Check" : "Close"}
        size={18}
        color={activeConfirm ? COLOR.primary50 : COLOR.black}
      />
    </Pressable>
  );
};

const BottomSheetHeader = ({
  title,
  confirmDisabled = false,
  className,
  closeAccessibilityLabel = "닫기",
  confirmAccessibilityLabel = "저장",
  onClose,
  onConfirm,
}: BottomSheetHeaderProps) => {
  return (
    <View
      className={cn(
        "h-[45px] w-full flex-row items-center justify-between px-[8px]",
        className,
      )}
    >
      <HeaderButton
        variant="close"
        accessibilityLabel={closeAccessibilityLabel}
        onPress={onClose}
      />
      <AppText
        variant="custom"
        weight="bold"
        numberOfLines={1}
        className="mx-[8px] min-w-0 flex-1 text-center text-[18px] leading-[32px] text-black"
      >
        {title}
      </AppText>
      <HeaderButton
        variant="confirm"
        disabled={confirmDisabled}
        accessibilityLabel={confirmAccessibilityLabel}
        onPress={onConfirm}
      />
    </View>
  );
};

export default BottomSheetHeader;

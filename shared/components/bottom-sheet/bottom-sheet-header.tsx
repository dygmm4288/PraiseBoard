import { Icon } from "@/assets/icons";
import { COLORS } from "@/shared/theme";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { Pressable, View } from "react-native";

type HeaderButtonProps = {
  variant: "close" | "confirm";
  disabled?: boolean;
  accessibilityLabel: string;
  testID: string;
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
  testID,
  onPress,
}: HeaderButtonProps) => {
  const isConfirm = variant === "confirm";
  const activeConfirm = isConfirm && !disabled;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      className={cn(
        "h-[39px] w-[39px] items-center justify-center rounded-full",
        activeConfirm ? "bg-primary-10" : "bg-surface-subtle",
        disabled && "opacity-60",
      )}
      onPress={onPress}
    >
      <Icon
        name={isConfirm ? "Check" : "Close"}
        size={18}
        color={
          activeConfirm ? COLORS.primary[50] : COLORS.content.primary
        }
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
        testID="bottom-sheet-close"
        accessibilityLabel={closeAccessibilityLabel}
        onPress={onClose}
      />
      <AppText
        variant="title18"
        weight="bold"
        numberOfLines={1}
        className="mx-[8px] min-w-0 flex-1 text-center text-black"
      >
        {title}
      </AppText>
      <HeaderButton
        variant="confirm"
        testID="bottom-sheet-confirm"
        disabled={confirmDisabled}
        accessibilityLabel={confirmAccessibilityLabel}
        onPress={onConfirm}
      />
    </View>
  );
};

export default BottomSheetHeader;

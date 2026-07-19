import { BottomSheetHeader } from "@/shared/components";

const SettingsSheetHeader = ({
  title,
  confirmDisabled,
  closeAccessibilityLabel,
  onClose,
  onConfirm,
}: {
  title: string;
  confirmDisabled?: boolean;
  closeAccessibilityLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <BottomSheetHeader
      title={title}
      confirmDisabled={confirmDisabled}
      closeAccessibilityLabel={closeAccessibilityLabel}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default SettingsSheetHeader;

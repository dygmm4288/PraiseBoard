import { BottomSheetHeader } from "@/shared/components";

const SettingsSheetHeader = ({
  title,
  confirmDisabled,
  onClose,
  onConfirm,
}: {
  title: string;
  confirmDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <BottomSheetHeader
      title={title}
      confirmDisabled={confirmDisabled}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default SettingsSheetHeader;

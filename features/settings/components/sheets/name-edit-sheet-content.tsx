import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MAX_LENGTH_MESSAGE,
} from "@/features/board/schema";
import { BottomSheetHeader, BottomSheetInput } from "@/shared/components";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import { useState } from "react";
import { View } from "react-native";

type NameEditSheetContentProps = {
  initialName: string;
  onClose: () => void;
  onConfirm: (name: string) => Promise<boolean>;
};

const NameEditSheetContent = ({
  initialName,
  onClose,
  onConfirm,
}: NameEditSheetContentProps) => {
  const [draftName, setDraftName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const handleChangeDraftName = (nextName: string) => {
    const reachedMaxLength =
      draftName.length < NICKNAME_MAX_LENGTH &&
      nextName.length >= NICKNAME_MAX_LENGTH;

    setDraftName(nextName);

    if (reachedMaxLength) {
      setTimeout(() => {
        toast.error(NICKNAME_MAX_LENGTH_MESSAGE);
      }, 0);
    }
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    const saved = await onConfirm(draftName);
    setIsSaving(false);

    if (saved) {
      onClose();
    }
  };

  return (
    <>
      <BottomSheetHeader
        title="이름 변경하기"
        confirmDisabled={isSaving}
        onClose={onClose}
        onConfirm={handleConfirm}
      />
      <View className="py-[21px]">
        <AppText
          variant="label12"
          weight="semibold"
          className="mb-[6px] text-labelGray"
        >
          이름
        </AppText>
        <BottomSheetInput
          value={draftName}
          maxLength={NICKNAME_MAX_LENGTH}
          editable={!isSaving}
          autoFocus
          reset
          onChangeText={handleChangeDraftName}
        />
      </View>
    </>
  );
};

export default NameEditSheetContent;

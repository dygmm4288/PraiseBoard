import { BottomSheetHeader } from "@/shared/components";
import { AppInput, AppText } from "@/shared/ui";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { View } from "react-native";

type NameEditSheetContentProps = {
  draftName: string;
  isSaving: boolean;
  onChangeDraftName: (name: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

const NameEditSheetContent = ({
  draftName,
  isSaving,
  onChangeDraftName,
  onClose,
  onConfirm,
}: NameEditSheetContentProps) => {
  return (
    <>
      <BottomSheetHeader
        title="이름 변경하기"
        confirmDisabled={isSaving}
        onClose={onClose}
        onConfirm={onConfirm}
      />
      <View className="py-[21px]">
        <AppText
          variant="custom"
          weight="semibold"
          className="mb-[6px] text-[12px] leading-[20px] text-labelGray"
        >
          이름
        </AppText>
        <AppInput
          value={draftName}
          maxLength={20}
          editable={!isSaving}
          autoFocus
          reset
          onChangeText={onChangeDraftName}
          inputComponent={BottomSheetTextInput}
        />
      </View>
    </>
  );
};

export default NameEditSheetContent;

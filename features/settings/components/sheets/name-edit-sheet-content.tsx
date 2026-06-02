import { AppText } from "@/shared/ui";
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native";
import SettingsSheetHeader from "./settings-sheet-header";

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 px-[16px]"
    >
      <SettingsSheetHeader
        title="이름 변경하기"
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
        <View className="h-[42px] flex-row items-center rounded-[12px] border border-primary-50 px-[12px]">
          <TextInput
            className="min-w-0 flex-1 p-0 font-pretendard text-[14px] leading-[20px] text-black"
            value={draftName}
            maxLength={20}
            editable={!isSaving}
            autoFocus
            onChangeText={onChangeDraftName}
          />
          {draftName.length > 0 && (
            <Pressable
              className="h-[22px] w-[22px] items-center justify-center"
              onPress={() => onChangeDraftName("")}
            >
              <AppText className="text-[18px] leading-[20px] text-labelGray">
                ×
              </AppText>
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NameEditSheetContent;

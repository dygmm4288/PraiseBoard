import {
  boardCreateDraftSchema,
  BoardCreateFormValues,
  REWARD_MEMO_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/features/board/schema";
import { EmojiPickerModal, useBoardEmojiOptions } from "@/features/emoji";
import { BottomSheetHeader } from "@/shared/components";
import { COLOR } from "@/shared/constants/colors.constant";
import { AppInput, AppText, ConfirmModal } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { ReactNode, useState } from "react";
import { Pressable, View } from "react-native";

const targetCountOptions = [
  { label: "30개", value: 30 },
  { label: "50개", value: 50 },
  { label: "100개", value: 100 },
];
const dailyLimitOptions = [
  { label: "1개", value: 1 },
  { label: "2개", value: 2 },
  { label: "3개", value: 3 },
  { label: "4개", value: 4 },
  { label: "5개", value: 5 },
];

type BoardFormMode = "create" | "edit";

type BoardFormProps = {
  title: string;
  mode?: BoardFormMode;
  formData: BoardCreateFormValues;
  onChangeFormData: <K extends keyof BoardCreateFormValues>(
    key: K,
  ) => (value: BoardCreateFormValues[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
};

type OptionRowProps = {
  options: { label: string; value: number }[];
  selectedValue: number;
  locked?: boolean;
  onSelect: (value: number) => void;
};

const OptionRow = ({
  options,
  selectedValue,
  locked = false,
  onSelect,
}: OptionRowProps) => {
  return (
    <View className="flex-row items-center gap-[6px]">
      {options.map(({ label, value }) => {
        const selected = value === selectedValue;
        const disabled = locked && !selected;

        return (
          <Pressable
            key={label}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            disabled={locked}
            className={cn(
              "h-[42px] min-w-0 flex-1 items-center justify-center rounded-[12px] border border-bgLightGray bg-white px-[12px]",
              selected && "rounded-[9px] border-primary-50 bg-primary-10",
            )}
            onPress={() => onSelect(value)}
          >
            <AppText
              variant="custom"
              weight="medium"
              numberOfLines={1}
              className={cn(
                "text-center text-[15px] leading-[25px]",
                selected ? "text-primary-50" : "text-bgDarkGray",
                disabled && "text-textGray",
              )}
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const BoardFormSection = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  return (
    <View className="gap-[6px]">
      <AppText
        variant="custom"
        weight="semibold"
        className="text-[12px] leading-[20px] text-labelGray"
      >
        {label}
      </AppText>
      {children}
    </View>
  );
};

const BoardForm = ({
  title,
  mode = "create",
  formData,
  onChangeFormData,
  onClose,
  onSubmit,
  onDelete,
  isDeleting = false,
}: BoardFormProps) => {
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const emojiOptions = useBoardEmojiOptions();
  const isEditMode = mode === "edit";
  const submitDisabled = !boardCreateDraftSchema.safeParse(formData).success;

  const handleDelete = () => {
    setDeleteConfirmVisible(false);
    onDelete?.();
  };

  const handleSelectEmoji = (emoji: string) => {
    onChangeFormData("emoji")(emoji);
    setEmojiPickerVisible(false);
  };

  return (
    <View className="flex-1">
      <BottomSheetHeader
        title={title}
        confirmDisabled={submitDisabled}
        onClose={onClose}
        onConfirm={onSubmit}
      />

      <BottomSheetScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 30,
          paddingTop: 21,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BoardFormSection label="습관 이름">
          <View className="flex-row items-center gap-[6px]">
            <AppInput
              reset
              inputComponent={BottomSheetTextInput}
              value={formData.title}
              onReset={() => onChangeFormData("title")("")}
              onChangeText={onChangeFormData("title")}
              maxLength={TITLE_MAX_LENGTH}
              placeholder="어떤 습관을 시작해볼까요?"
              placeholderTextColor={COLOR.textGray}
              className="flex-1"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="대표 이모지 선택"
              className="h-[42px] min-h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-bgLightGray bg-white"
              onPress={() => setEmojiPickerVisible(true)}
            >
              <AppText
                variant="custom"
                className="text-center text-[20px] leading-[24px] text-black"
              >
                {formData.emoji || "🌱"}
              </AppText>
            </Pressable>
          </View>
        </BoardFormSection>

        <BoardFormSection label="목표 개수">
          <OptionRow
            options={targetCountOptions}
            selectedValue={formData.targetCount}
            locked={isEditMode}
            onSelect={onChangeFormData("targetCount")}
          />
        </BoardFormSection>

        <BoardFormSection label="하루 최대">
          <OptionRow
            options={dailyLimitOptions}
            selectedValue={formData.limitCount}
            locked={isEditMode}
            onSelect={onChangeFormData("limitCount")}
          />
        </BoardFormSection>

        <BoardFormSection label="보상 (선택)">
          <AppInput
            inputComponent={BottomSheetTextInput}
            value={formData.rewardMemo ?? ""}
            onChangeText={onChangeFormData("rewardMemo")}
            placeholder="나에게 어떤 선물을 주고싶나요?"
            maxLength={REWARD_MEMO_LENGTH}
            placeholderTextColor={COLOR.textGray}
          />
        </BoardFormSection>

        {isEditMode && onDelete ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="습관 삭제"
            disabled={isDeleting}
            className="items-center justify-center"
            onPress={() => setDeleteConfirmVisible(true)}
          >
            <AppText
              variant="custom"
              weight="semibold"
              className="text-center text-[12px] leading-[20px] text-labelGray"
            >
              삭제하기
            </AppText>
          </Pressable>
        ) : null}
      </BottomSheetScrollView>

      <ConfirmModal
        visible={deleteConfirmVisible}
        title="정말로 삭제하고 싶나요?"
        description={
          "지금 삭제하면, 모든 기록이 영구적으로 사라져요.\n다시 찾을 수 없어요."
        }
        cancelText="취소"
        confirmText="삭제하기"
        confirmVariant="danger"
        confirmDisabled={isDeleting}
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={handleDelete}
      />
      <EmojiPickerModal
        visible={emojiPickerVisible}
        selectedEmoji={formData.emoji}
        options={emojiOptions}
        onSelect={handleSelectEmoji}
        onClose={() => setEmojiPickerVisible(false)}
      />
    </View>
  );
};

export default BoardForm;

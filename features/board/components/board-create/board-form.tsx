import {
  boardCreateDraftSchema,
  BoardCreateFormValues,
  REWARD_MEMO_LENGTH,
  TITLE_MAX_LENGTH,
} from "@/features/board/schema";
import { EmojiPickerModal, useBoardEmojiOptions } from "@/features/emoji";
import { BottomSheetHeader, BottomSheetInput } from "@/shared/components";
import { COLORS } from "@/shared/theme";
import { toast } from "@/shared/toasts/toast";
import { AppText, ConfirmModal } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
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
  onDeleteCancel?: () => void;
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
              "h-[42px] min-w-0 flex-1 items-center justify-center rounded-[12px] border border-line-subtle px-[12px]",
              selected && "rounded-[9px] border-primary-50 bg-primary-10",
              !selected && "bg-white ",
            )}
            onPress={() => onSelect(value)}
          >
            <AppText
              variant="button15"
              weight="medium"
              numberOfLines={1}
              className={cn(
                "text-center",
                selected ? "text-primary-50" : "text-neutral-700",
                disabled && "text-content-disabled",
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
        variant="label12"
        weight="semibold"
        className="text-content-tertiary"
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
  onDeleteCancel,
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

  const handleDeleteCancel = () => {
    setDeleteConfirmVisible(false);
    onDeleteCancel?.();
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
            <BottomSheetInput
              testID="board-title-input"
              reset
              value={formData.title}
              onReset={() => onChangeFormData("title")("")}
              onChangeText={onChangeFormData("title")}
              maxLength={TITLE_MAX_LENGTH}
              onBlur={toast.hideToast}
              onMaxLengthExceeded={() =>
                toast.error(
                  `습관 이름은 ${TITLE_MAX_LENGTH}자까지 입력할 수 있어요.`,
                )
              }
              placeholder="어떤 습관을 시작해볼까요?"
              placeholderTextColor={COLORS.content.disabled}
              className="flex-1"
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="대표 이모지 선택"
              className="h-[42px] min-h-[42px] w-[42px] items-center justify-center rounded-[12px] border border-line-subtle bg-white"
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
          <BottomSheetInput
            testID="board-reward-input"
            value={formData.rewardMemo ?? ""}
            onChangeText={onChangeFormData("rewardMemo")}
            placeholder="나에게 어떤 선물을 주고싶나요?"
            maxLength={REWARD_MEMO_LENGTH}
            onBlur={toast.hideToast}
            onMaxLengthExceeded={() =>
              toast.error(
                `보상은 ${REWARD_MEMO_LENGTH}자까지 입력할 수 있어요.`,
              )
            }
            placeholderTextColor={COLORS.content.disabled}
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
              variant="label12"
              weight="semibold"
              className="text-center text-content-tertiary"
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
        onCancel={handleDeleteCancel}
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

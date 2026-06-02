import { Icon } from "@/assets/icons";
import {
  BoardCreateFormValues,
  boardCreateDraftSchema,
} from "@/features/board/schema";
import { COLOR } from "@/shared/constants/colors.constant";
import { AppInput, AppText, ConfirmModal } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";
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
  options: Array<{ label: string; value: number }>;
  selectedValue: number;
  locked?: boolean;
  onSelect: (value: number) => void;
};

const SheetHeaderButton = ({
  variant,
  disabled,
  onPress,
}: {
  variant: "close" | "confirm";
  disabled?: boolean;
  onPress: () => void;
}) => {
  const isConfirm = variant === "confirm";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isConfirm ? "저장" : "닫기"}
      disabled={disabled}
      className={cn(
        "h-[39px] w-[39px] items-center justify-center rounded-full",
        isConfirm && !disabled ? "bg-primary-10" : "bg-bgLightGray",
        disabled && "opacity-60",
      )}
      onPress={onPress}
    >
      <Icon
        name={isConfirm ? "Check" : "Close"}
        size={18}
        color={isConfirm && !disabled ? COLOR.primary50 : COLOR.black}
      />
    </Pressable>
  );
};

const BoardFormHeader = ({
  title,
  submitDisabled,
  onClose,
  onSubmit,
}: {
  title: string;
  submitDisabled: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <View className="h-[45px] w-full flex-row items-center justify-between px-[8px]">
      <SheetHeaderButton variant="close" onPress={onClose} />
      <AppText
        variant="custom"
        weight="bold"
        className="text-[18px] leading-[32px] text-black"
      >
        {title}
      </AppText>
      <SheetHeaderButton
        variant="confirm"
        disabled={submitDisabled}
        onPress={onSubmit}
      />
    </View>
  );
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
  children: React.ReactNode;
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
  const isEditMode = mode === "edit";
  const submitDisabled = !boardCreateDraftSchema.safeParse(formData).success;

  const handleDelete = () => {
    setDeleteConfirmVisible(false);
    onDelete?.();
  };

  return (
    <View className="flex-1">
      <BoardFormHeader
        title={title}
        submitDisabled={submitDisabled}
        onClose={onClose}
        onSubmit={onSubmit}
      />

      <View className="gap-[30px] py-[21px]">
        <BoardFormSection label="습관 이름">
          <View className="flex-row items-center gap-[6px]">
            <AppInput
              reset
              value={formData.title}
              onReset={() => onChangeFormData("title")("")}
              onChangeText={onChangeFormData("title")}
              placeholder="어떤 습관을 시작해볼까요?"
              placeholderTextColor={COLOR.textGray}
              className="h-[42px] min-h-[42px] flex-1 rounded-[12px] border-bgLightGray px-[12px] py-[10px]"
              inputClassName="min-w-0 flex-1 p-0 text-[14px] leading-[20px] text-black"
            />
            <AppInput
              value={formData.emoji}
              onChangeText={onChangeFormData("emoji")}
              placeholder="🌱"
              placeholderTextColor={COLOR.black}
              className="h-[42px] min-h-[42px] w-[42px] rounded-[12px] border-bgLightGray px-[10px] py-[6px]"
              inputClassName="p-0 text-center text-[20px] leading-[24px] text-black"
            />
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
            value={formData.rewardMemo ?? ""}
            onChangeText={onChangeFormData("rewardMemo")}
            placeholder="나에게 어떤 선물을 주고싶나요?"
            placeholderTextColor={COLOR.textGray}
            className="h-[42px] min-h-[42px] rounded-[12px] border-bgLightGray px-[12px] py-[10px]"
            inputClassName="min-w-0 flex-1 p-0 text-[14px] leading-[20px] text-black"
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
      </View>

      <ConfirmModal
        visible={deleteConfirmVisible}
        title="정말로 삭제하고 싶나요?"
        description={"지금 삭제하면, 모든 기록이 영구적으로 사라져요.\n다시 찾을 수 없어요."}
        cancelText="취소"
        confirmText="삭제하기"
        confirmVariant="danger"
        confirmDisabled={isDeleting}
        onCancel={() => setDeleteConfirmVisible(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
};

export default BoardForm;

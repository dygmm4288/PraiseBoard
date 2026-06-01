import { cn } from "@/shared/utils/cn";
import React from "react";
import {
  Modal,
  Pressable,
  View,
  type ModalProps,
  type PressableProps,
} from "react-native";
import { AppText } from "./text";

type ConfirmModalButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  variant: "cancel" | "confirm";
};

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onRequestClose?: ModalProps["onRequestClose"];
  confirmDisabled?: boolean;
};

const ConfirmModalButton = ({
  label,
  variant,
  disabled,
  className,
  ...props
}: ConfirmModalButtonProps) => {
  const isConfirm = variant === "confirm";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={cn(
        "h-[42px] min-w-0 flex-1 items-center justify-center rounded-[9px] px-[12px]",
        isConfirm ? "bg-primary-50" : "bg-primary-10",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <AppText
        numberOfLines={1}
        ellipsizeMode="tail"
        className={cn(
          "w-full text-center text-[15px] leading-[25px]",
          isConfirm ? "text-white" : "text-primary-20",
        )}
        weight={isConfirm ? "medium" : "regular"}
        variant="custom"
      >
        {label}
      </AppText>
    </Pressable>
  );
};

export const ConfirmModal = ({
  visible,
  title,
  description,
  cancelText = "text",
  confirmText = "긍정 액션",
  onCancel,
  onConfirm,
  onRequestClose,
  confirmDisabled = false,
}: ConfirmModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={onRequestClose ?? onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/30 px-[45px]">
        <View className="w-full max-w-[312px] items-center justify-center gap-[21px] rounded-[18px] bg-white p-[21px]">
          <View className="w-full items-center gap-[12px]">
            <AppText
              className="w-full text-center text-[16px] leading-[24px] text-gray-900"
              variant="custom"
              weight="bold"
            >
              {title}
            </AppText>

            {description ? (
              <AppText
                className="w-full text-center text-[14px] leading-[20px] text-gray-900"
                variant="custom"
                weight="regular"
              >
                {description}
              </AppText>
            ) : null}
          </View>

          <View className="w-full flex-row items-center gap-[6px]">
            <ConfirmModalButton
              label={cancelText}
              variant="cancel"
              onPress={onCancel}
            />
            <ConfirmModalButton
              label={confirmText}
              variant="confirm"
              disabled={confirmDisabled}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

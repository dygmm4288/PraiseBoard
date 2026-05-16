import type { Meta, StoryObj } from "@storybook/react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { AppButton } from "./button";
import { ConfirmModal } from "./confirm-modal";

type ConfirmModalStoryProps = {
  visible: boolean;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
};

const ConfirmModalStory = ({
  visible: initialVisible,
  title,
  description,
  cancelText,
  confirmText,
}: ConfirmModalStoryProps) => {
  const [visible, setVisible] = useState(initialVisible);

  useEffect(() => {
    setVisible(initialVisible);
  }, [initialVisible]);

  return (
    <View className="flex-1 items-center justify-center bg-white px-[24px]">
      <AppButton label="모달 열기" onPress={() => setVisible(true)} fullWidth />
      <ConfirmModal
        visible={visible}
        title={title}
        description={description}
        cancelText={cancelText}
        confirmText={confirmText}
        onCancel={() => setVisible(false)}
        onConfirm={() => setVisible(false)}
      />
    </View>
  );
};

const meta = {
  title: "UI/ConfirmModal",
  component: ConfirmModalStory,
  args: {
    visible: true,
    title: "타이틀",
    description: "본문",
    cancelText: "text",
    confirmText: "긍정 액션",
  },
  argTypes: {
    visible: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ConfirmModalStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongText: Story = {
  args: {
    title: "보드를 삭제할까요?",
    description: "삭제한 보드는 다시 복구할 수 없어요.",
    cancelText: "취소",
    confirmText: "삭제하기",
  },
};

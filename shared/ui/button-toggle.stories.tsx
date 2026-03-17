import Icon from "@/assets/icons/icon";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ButtonToggle from "./button-toggle";

type ViewMode = "board" | "list";

type ButtonToggleStoryProps = {
  value: ViewMode;
  width?: number;
  disabled?: boolean;
};

const OPTIONS = [
  {
    value: "board" as const,
    accessibilityLabel: "보드 보기",
    render: () => <Icon name="BoardToggle" size={24} />,
  },
  {
    value: "list" as const,
    accessibilityLabel: "리스트 보기",
    render: () => <Icon name="BoardList" size={24} />,
  },
];

const ButtonToggleStory = ({
  value: initialValue,
  width,
  disabled = false,
}: ButtonToggleStoryProps) => {
  const [value, setValue] = useState<ViewMode>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <ButtonToggle
      value={value}
      options={OPTIONS}
      onChange={setValue}
      width={width}
      disabled={disabled}
    />
  );
};

const meta = {
  title: "UI/ButtonToggle",
  component: ButtonToggleStory,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          padding: 24,
        }}
      >
        <Story />
      </View>
    ),
  ],
  args: {
    value: "board",
    disabled: false,
  },
  argTypes: {
    value: {
      control: "radio",
      options: ["board", "list"],
    },
    width: {
      control: "number",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ButtonToggleStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const ListView: Story = {
  args: {
    value: "list",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

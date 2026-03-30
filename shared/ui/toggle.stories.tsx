import type { Meta, StoryObj } from "@storybook/react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toggle from "./toggle";

type ToggleStoryProps = {
  value: boolean;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
};

const ToggleStory = ({
  value: initialValue,
  disabled = false,
  activeColor,
  inactiveColor,
}: ToggleStoryProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Toggle
      value={value}
      disabled={disabled}
      activeColor={activeColor}
      inactiveColor={inactiveColor}
      accessibilityLabel="토글"
      onValueChange={setValue}
    />
  );
};

const meta = {
  title: "UI/Toggle",
  component: ToggleStory,
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
    value: true,
    disabled: false,
  },
  argTypes: {
    value: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    activeColor: {
      control: "color",
    },
    inactiveColor: {
      control: "color",
    },
  },
} satisfies Meta<typeof ToggleStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const On: Story = {};

export const Off: Story = {
  args: {
    value: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CustomColors: Story = {
  args: {
    value: true,
    activeColor: "#111111",
    inactiveColor: "#E3E3E6",
  },
};

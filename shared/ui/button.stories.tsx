import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";
import { AppButton } from "./button";

const meta = {
  title: "UI/AppButton",
  component: AppButton,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    label: "button",
    onPress: fn(),
    fullWidth: true,
  },
  argTypes: {
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof AppButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};
export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
  },
};

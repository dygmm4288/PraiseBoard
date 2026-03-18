import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import Header from "./header";

const meta = {
  title: "Board/Header",
  component: Header,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 14,
          paddingTop: 24,
        }}
      >
        <Story />
      </View>
    ),
  ],
  args: {
    title: "칭찬 보드",
    showTitle: true,
  },
  argTypes: {
    title: {
      control: "text",
    },
    showTitle: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithoutTitle: Story = {
  args: {
    showTitle: false,
  },
};

import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import PaginationIndicator from "./pagination-indicator";

const meta = {
  title: "UI/PaginationIndicator",
  component: PaginationIndicator,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Story />
      </View>
    ),
  ],
  args: {
    name: "onboarding",
    totalCnt: 5,
    currentIndex: 2,
  },
  argTypes: {
    totalCnt: {
      control: "number",
    },
    currentIndex: {
      control: "number",
    },
  },
} satisfies Meta<typeof PaginationIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

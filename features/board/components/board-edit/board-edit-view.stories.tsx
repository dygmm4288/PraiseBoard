import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { fn } from "storybook/test";
import BoardEditView from "./board-edit-view";

const meta = {
  title: "Board/BoardEdit",
  component: BoardEditView,
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
  args: {
    title: "타이틀",
    deleteLabel: "삭제",
    onBack: fn(),
    onDelete: fn(),
  },
  argTypes: {
    title: {
      control: "text",
    },
    deleteLabel: {
      control: "text",
    },
  },
} satisfies Meta<typeof BoardEditView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const LongTitle: Story = {
  args: {
    title: "매일 물 한 잔 챌린지",
  },
};

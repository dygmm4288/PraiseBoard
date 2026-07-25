import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { BoardScreenContent } from "./board-screen";

const meta = {
  title: "Board/BoardScreen",
  component: BoardScreenContent,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BoardScreenContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

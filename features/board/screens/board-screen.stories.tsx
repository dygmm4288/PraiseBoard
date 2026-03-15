import { BoardCardData } from "@/features/board/types/board-card.type";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { BoardScreenContent } from "./BoardScreen";

const DEFAULT_BOARD_STORY_DATA: BoardCardData = {
  title: "아침에 물 한 잔",
  rewardMemo: "새로운 화분 구매",
  totalCount: 100,
  completedCount: 1,
};

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
  args: {
    board: DEFAULT_BOARD_STORY_DATA,
  },
} satisfies Meta<typeof BoardScreenContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

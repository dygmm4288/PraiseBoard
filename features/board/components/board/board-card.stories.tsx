import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { BoardProvider } from "../../hooks";
import BoardCard from "./board-card";

type BoardCardStoryProps = {
  totalCount: number;
  completedCount: number;
  columns?: number;
};

const DEFAULT_BOARD_CARD_DATA = {
  id: "board-story-1",
  title: "아침에 물 한 잔",
  rewardMemo: "새로운 화분 구매",
} as const;

const BoardCardStory = ({
  totalCount,
  completedCount,
  columns = 10,
}: BoardCardStoryProps) => {
  return (
    <BoardProvider
      value={{
        isLoading: false,
        errorMessage: null,
        collectSticker: async () => undefined,
        boardData: {
          ...DEFAULT_BOARD_CARD_DATA,
          totalCount,
          completedCount,
          todayStickerCount: 1,
          latestStickerCollectedAt: new Date().toISOString(),
        },
      }}
    >
      <BoardCard columns={columns} />
    </BoardProvider>
  );
};

const meta = {
  title: "Board/BoardCard",
  component: BoardCardStory,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: "#E3E3E6", padding: 14 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    totalCount: 100,
    completedCount: 1,
    columns: 10,
  },
  argTypes: {
    totalCount: {
      control: "number",
    },
    completedCount: {
      control: "number",
    },
    columns: {
      control: "number",
    },
  },
} satisfies Meta<typeof BoardCardStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initial: Story = {};

export const HalfFilled: Story = {
  args: {
    completedCount: 50,
  },
};

export const Completed: Story = {
  args: {
    completedCount: 100,
  },
};

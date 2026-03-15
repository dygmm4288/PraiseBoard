import { BoardCardData } from "@/features/board/types/board-card.type";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import BoardCard from "./board-card";

type BoardCardStoryProps = BoardCardData & {
  columns?: number;
};

const BoardCardStory = ({
  title,
  rewardMemo,
  totalCount,
  completedCount,
  columns = 10,
}: BoardCardStoryProps) => {
  return (
    <BoardCard
      data={{
        title,
        rewardMemo,
        totalCount,
        completedCount,
      }}
      columns={columns}
    />
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
    title: "아침에 물 한 잔",
    rewardMemo: "새로운 화분 구매",
    totalCount: 100,
    completedCount: 1,
    columns: 10,
  },
  argTypes: {
    title: {
      control: "text",
    },
    rewardMemo: {
      control: "text",
    },
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

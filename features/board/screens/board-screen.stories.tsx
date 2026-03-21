import { BoardCardData } from "@/features/board/types/board-card.type";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { BoardProvider, BoardUIProvider } from "../hooks";
import { BoardScreenContent } from "./BoardScreen";

type BoardScreenStoryProps = BoardCardData;

const DEFAULT_BOARD_STORY_DATA: BoardScreenStoryProps = {
  title: "아침에 물 한 잔",
  rewardMemo: "새로운 화분 구매",
  totalCount: 100,
  completedCount: 1,
};

const BoardScreenStory = ({
  title,
  rewardMemo,
  totalCount,
  completedCount,
}: BoardScreenStoryProps) => {
  return (
    <BoardProvider
      value={{
        isLoading: false,
        errorMessage: null,
        boardData: {
          title,
          rewardMemo,
          totalCount,
          completedCount,
        },
      }}
    >
      <BoardUIProvider
        value={{
          isBoardOpen: false,
          toggleBoardOpen: () => undefined,
          titleMode: "main",
        }}
      >
        <BoardScreenContent />
      </BoardUIProvider>
    </BoardProvider>
  );
};

const meta = {
  title: "Board/BoardScreen",
  component: BoardScreenStory,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  args: DEFAULT_BOARD_STORY_DATA,
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
  },
} satisfies Meta<typeof BoardScreenStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Midway: Story = {
  args: {
    completedCount: 50,
  },
};

export const Completed: Story = {
  args: {
    completedCount: 100,
  },
};

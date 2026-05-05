import { BoardCardData } from "@/features/board/types";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { BoardProvider, BoardUIProvider } from "../hooks";
import { BoardScreenContent } from "./BoardScreen";

type BoardScreenStoryProps = BoardCardData;

const DEFAULT_BOARD_STORY_DATA: BoardScreenStoryProps = {
  id: "board-screen-story",
  title: "아침에 물 한 잔",
  rewardMemo: "새로운 화분 구매",
  totalCount: 100,
  completedCount: 1,
  todayStickerCount: 1,
  latestStickerCollectedAt: new Date().toISOString(),
};

const BoardScreenStory = ({
  id,
  title,
  rewardMemo,
  totalCount,
  completedCount,
  todayStickerCount,
  latestStickerCollectedAt,
}: BoardScreenStoryProps) => {
  return (
    <BoardProvider
      value={{
        isLoading: false,
        errorMessage: null,
        collectSticker: async () => undefined,
        boardData: {
          id,
          title,
          rewardMemo,
          totalCount,
          completedCount,
          todayStickerCount,
          latestStickerCollectedAt,
        },
      }}
    >
      <BoardUIProvider
        value={{
          boardSheetState: "peek",
          setBoardSheetState: () => undefined,
          isBoardExpanded: false,
          titleMode: "header",
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
    todayStickerCount: {
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

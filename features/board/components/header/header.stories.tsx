import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { BoardProvider } from "../../hooks";
import Header from "./header";

type HeaderStoryProps = {
  title: string;
  showTitle: boolean;
};

const HeaderStory = ({ title, showTitle }: HeaderStoryProps) => {
  return (
    <BoardProvider
      value={{
        isLoading: false,
        errorMessage: null,
        boardData: {
          title,
          rewardMemo: null,
          totalCount: 100,
          completedCount: 1,
        },
        titleMode: showTitle ? "header" : "main",
      }}
    >
      <Header />
    </BoardProvider>
  );
};

const meta = {
  title: "Board/Header",
  component: HeaderStory,
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
} satisfies Meta<typeof HeaderStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const WithoutTitle: Story = {
  args: {
    showTitle: false,
  },
};

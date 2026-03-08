import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { ChatBubble } from "./chat-bubble";

const meta = {
  title: "onboard/chat-bubble",
  component: ChatBubble,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: "flex-start", padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  args: {
    message: "text",
    side: "left",
    showTyping: false,
  },
  argTypes: {
    side: {
      control: "radio",
      options: ["left", "right", "center"],
    },
    showTyping: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof ChatBubble>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

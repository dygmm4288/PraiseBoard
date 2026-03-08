import type { Meta, StoryObj } from "@storybook/react-native";
import { useState } from "react";
import { View } from "react-native";
import { fn } from "storybook/test";
import ChatInput from "./chat-input";

const meta = {
  title: "onboard/chat-input",
  component: ChatInput,
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          padding: 30,
        }}
      >
        <Story />
      </View>
    ),
  ],
  args: {
    value: "",
    onChangeText: fn(),
    onSend: fn(),
    placeholder: "이름을 알려주세요",
  },
  argTypes: {},
} satisfies Meta<typeof ChatInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: (args) => {
    const ChatInputStory = (props: typeof args) => {
      const [value, setValue] = useState("");

      return (
        <ChatInput
          {...props}
          value={value}
          onChangeText={setValue}
          onSend={() => setValue("send")}
        />
      );
    };

    return <ChatInputStory {...args} />;
  },
};

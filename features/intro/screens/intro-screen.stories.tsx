import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";
import {
  IntroScreenContent,
  INTRO_STEP_VALUES,
} from "@/features/intro/screens/IntroScreen";

const meta = {
  title: "Intro/IntroScreen",
  component: IntroScreenContent,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <Story />
      </View>
    ),
  ],
  args: {
    defaultStep: "intro0",
    onComplete: fn(),
  },
  argTypes: {
    defaultStep: {
      control: "radio",
      options: [...INTRO_STEP_VALUES],
    },
  },
} satisfies Meta<typeof IntroScreenContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstStep: Story = {};

export const LastStep: Story = {
  args: {
    defaultStep: "intro1",
  },
};

import { UserFlowOverrideMode } from "@/services/user";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { fn } from "storybook/test";
import { DebugSettingsScreenContent } from "./DebugSettingsScreen";

const OVERRIDE_MODE_OPTIONS: UserFlowOverrideMode[] = [
  "real",
  "intro",
  "onboarding",
  "board",
];

const meta = {
  title: "Debug/DebugSettingsScreen",
  component: DebugSettingsScreenContent,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
        <Story />
      </View>
    ),
  ],
  args: {
    hasSeenIntro: true,
    hasCompletedOnboarding: false,
    overrideMode: "onboarding",
    isDebugUserFlowEnabled: true,
    effectiveHasSeenIntro: true,
    effectiveHasCompletedOnboarding: false,
    onOverridePress: fn(),
    onResetPress: fn(),
  },
  argTypes: {
    overrideMode: {
      control: "radio",
      options: OVERRIDE_MODE_OPTIONS,
    },
    onOverridePress: {
      control: false,
    },
    onResetPress: {
      control: false,
    },
  },
} satisfies Meta<typeof DebugSettingsScreenContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DebugEnabled: Story = {};

export const ForcedIntro: Story = {
  args: {
    overrideMode: "intro",
    effectiveHasSeenIntro: false,
    effectiveHasCompletedOnboarding: false,
  },
};

export const DebugDisabled: Story = {
  args: {
    isDebugUserFlowEnabled: false,
    overrideMode: "real",
  },
};

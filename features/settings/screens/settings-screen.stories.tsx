import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SettingsScreen from "./SettingsScreen";

const meta = {
  title: "Settings/SettingsScreen",
  component: SettingsScreen,
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
} satisfies Meta<typeof SettingsScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

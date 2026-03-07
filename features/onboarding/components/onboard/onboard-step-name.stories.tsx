import { BOARD_SETUP_DEFAULT_VALUES, BoardSetupFormValues } from "@/shared/schemas/board.schema";
import type { Meta, StoryObj } from "@storybook/react-native";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import OnboardStepName from "./onboard-step-name";

type StepNameStoryProps = {
  nickname?: string;
};

const StepNameStory = ({ nickname = "" }: StepNameStoryProps) => {
  const form = useForm<BoardSetupFormValues>({
    defaultValues: {
      ...BOARD_SETUP_DEFAULT_VALUES,
      profiles: {
        nickname,
      },
    },
  });

  return <OnboardStepName form={form} onPress={async () => undefined} />;
};

const meta = {
  title: "Onboarding/OnboardStepName",
  component: StepNameStory,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#eff8ff" }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof StepNameStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {},
};

export const Prefilled: Story = {
  args: {
    nickname: "고래친구",
  },
};

import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { fn } from "storybook/test";
import type { OnboardStepProps } from "../types/onboard-step.type";
import OnboardStepLayout from "../components/onboard/onboard-step-layout";
import { AppButton, AppText } from "@/shared/ui";
import {
  ONBOARD_STEP_VALUES,
  OnboardScreenContent,
} from "@/features/onboarding/screens/OnboardScreen";

const STORY_INITIAL_VALUES = {
  profiles: {
    nickname: "고래친구",
  },
  boards: {
    title: "아침에 물 한 잔",
    target_count: "30",
    reward_memo: "새 화분 구매",
  },
};

const StorybookNotificationStep = ({ form }: OnboardStepProps) => {
  return (
    <OnboardStepLayout stepName="notification">
      <View className="flex-1 justify-center gap-4 px-4">
        <View className="rounded-[24px] bg-[#F7F7F9] px-5 py-5">
          <AppText variant="title3" className="text-gray-700">
            알림 권한 요청 미리보기
          </AppText>
          <AppText variant="body3" className="mt-2 text-gray-500">
            Storybook에서는 실제 저장과 권한 요청 대신 마지막 단계 요약만
            보여줍니다.
          </AppText>
        </View>

        <View className="rounded-[24px] bg-white px-5 py-5">
          <AppText variant="body3" className="text-gray-500">
            이름: {form.getValues("profiles.nickname") || "-"}
          </AppText>
          <AppText variant="body3" className="mt-2 text-gray-500">
            보드 제목: {form.getValues("boards.title") || "-"}
          </AppText>
          <AppText variant="body3" className="mt-2 text-gray-500">
            목표 개수: {form.getValues("boards.target_count") || "-"}
          </AppText>
          <AppText variant="body3" className="mt-2 text-gray-500">
            보상: {form.getValues("boards.reward_memo") || "미입력"}
          </AppText>
        </View>

        <AppButton
          fullWidth
          label="온보딩 완료 액션"
          onPress={fn()}
        />
      </View>
    </OnboardStepLayout>
  );
};

const meta = {
  title: "Onboarding/OnboardScreen",
  component: OnboardScreenContent,
  decorators: [
    (Story) => (
      <KeyboardProvider>
        <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
          <Story />
        </View>
      </KeyboardProvider>
    ),
  ],
  args: {
    defaultStep: "name",
    initialValues: STORY_INITIAL_VALUES,
  },
  argTypes: {
    defaultStep: {
      control: "radio",
      options: ONBOARD_STEP_VALUES,
    },
    initialValues: {
      control: false,
    },
  },
  render: (args) => (
    <OnboardScreenContent
      {...args}
      renderNotificationStep={(props) => (
        <StorybookNotificationStep {...props} />
      )}
    />
  ),
} satisfies Meta<typeof OnboardScreenContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NameStep: Story = {};

export const GoalStep: Story = {
  args: {
    defaultStep: "title",
  },
};

export const NotificationPreview: Story = {
  args: {
    defaultStep: "notification",
  },
};

import { AppText } from "@/shared/ui";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatChip from "../chat/chat-chip";
import ChatInput from "../chat/chat-input";
import OnboardStepLayout from "./onboard-step-layout";

const CHIPS = [
  { icon: "🌟", text: "30개" },
  { icon: "🔥", text: "50개" },
  { icon: "💯", text: "100개" },
];

const OnboardStepLimit = ({ form, onSend }: OnboardStepProps) => {
  const Chips = () =>
    CHIPS.map((props) => <ChatChip key={props.icon} {...props} />);

  return (
    <OnboardStepLayout stepName="title">
      <View className="flex-1">
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={12}
          extraKeyboardSpace={8}
        >
          <ChatBubbleList>
            <ChatBubble
              message={`${form.getValues("profiles.nickname")}님이 원하는 구슬 개수를 골라주세요. 속도에 맞춰 드릴게요!`}
            />
          </ChatBubbleList>
          <View className="mt-[40px] flex flx-col justify-center gap-[10px]">
            <AppText variant="caption1" className="text-gray-400 text-center">
              한 번 선택한 구슬 개수를 변경할 수 없어요. 신중하게 선택해주세요.
            </AppText>
            <View className="w-full flex-row flex-wrap items-center justify-center gap-[6px]">
              <Chips />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepLimit;

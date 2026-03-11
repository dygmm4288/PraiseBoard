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
  { icon: "🥛", text: "아침에 물 한 잔" },
  { icon: "📖", text: "독서하기" },
  { icon: "🎸", text: "악기 연주하기" },
  { icon: "💼", text: "칼퇴하기" },
  { icon: "🪴", text: "화분 물주기" },
  { icon: "📝", text: "감사일기 쓰기" },
];
const OnboardStepTitle = ({ form, onSend }: OnboardStepProps) => {
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
              message={`반가워요!${form.getValues("profiles.nickname")}님`}
            />
            <ChatBubble message="첫번째 목표를 정하기 위해 준비가 필요해요. 우선, 무엇을 먼저 시작해보고 싶어요?" />
          </ChatBubbleList>
          <View className="mt-[40px] flex flx-col justify-center gap-[10px]">
            <AppText variant="caption1" className="text-gray-400 text-center">
              직접 입력하거나 아래에서 선택해도 좋아요!
            </AppText>
            <View className="w-full flex-row flex-wrap items-center justify-center gap-[6px]">
              <Chips />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <KeyboardStickyView
          offset={{ closed: 0, opened: 0 }}
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <View className="bg-white py-[8px]">
            <Controller
              name="profiles.nickname"
              control={form.control}
              render={({ field }) => (
                <ChatInput
                  placeholder="이름을 알려주세요"
                  value={field.value}
                  onChangeText={field.onChange}
                  onSend={onSend}
                />
              )}
            />
          </View>
        </KeyboardStickyView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepTitle;

import { AppText } from "@/shared/ui";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatChip from "../chat/chat-chip";
import OnboardStepLayout from "./onboard-step-layout";

const CHIPS = [
  { icon: "🌟", text: "30개" },
  { icon: "🔥", text: "50개" },
  { icon: "💯", text: "100개" },
];

const OnboardStepLimit = ({ form, onSend }: OnboardStepProps) => {
  const [showChips, setShowChips] = useState(false);
  const { messages, addUserMessage, run, disabled } = useOnboardChat({
    whaleMessages: [
      {
        message: `${form.getValues("profiles.nickname")}님이 원하는 구슬 개수를 골라주세요. 속도에 맞춰 드릴게요!`,
      },
      {
        message:
          "첫번째 목표를 정하기 위해 준비가 필요해요. 우선, 무엇을 먼저 시작해보고 싶어요?",
        userDisabled: false,
        onOk: () => setShowChips(true),
      },
    ],
  });

  useEffect(() => {
    run();
  }, []);

  const Chips = () =>
    CHIPS.map((props) => (
      <ChatChip
        key={props.icon}
        {...props}
        onPress={async () => {
          await addUserMessage(props.text);
          await onSend();
          form.setValue("boards.title", props.text);
        }}
      />
    ));

  return (
    <OnboardStepLayout stepName="limit">
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
            {messages.map((v, i) => (
              <>
                <ChatBubble
                  key={`onboard-step-name${i}`}
                  showTyping={v.type === "typing"}
                  message={v.message ?? ""}
                  side={v.role === "system" ? "left" : "right"}
                />
                {/* TODO 조건 수정 */}
                {showChips && v.role === "system" && i === 1 && (
                  <View className="mt-[40px] flex flx-col justify-center gap-[10px]">
                    <AppText
                      variant="caption1"
                      className="text-gray-400 text-center"
                    >
                      한 번 선택한 구슬 개수를 변경할 수 없어요. 신중하게
                      선택해주세요.
                    </AppText>
                    <View className="w-full flex-row flex-wrap items-center justify-center gap-[6px]">
                      <Chips />
                    </View>
                  </View>
                )}
              </>
            ))}
          </ChatBubbleList>
        </KeyboardAwareScrollView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepLimit;

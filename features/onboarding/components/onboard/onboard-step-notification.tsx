import { board, normalizeBoardSetupPayload } from "@/features/board";
import { notification } from "@/services/notification";
import { useUser, userRepository } from "@/services/user";
import { toast } from "@/shared/toasts/toast";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useOnboardChat from "../../hooks/use-onboard-chat";
import useOnboardingCompletionFlow from "../../hooks/use-onboarding-completion-flow";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import OnboardStepLayout from "./onboard-step-layout";

const OnboardStepNotification = ({ form }: OnboardStepProps) => {
  const hasStartedRef = useRef(false);
  const { completeWithHomePreview } = useOnboardingCompletionFlow({ form });

  const { messages, run } = useOnboardChat({
    whaleMessages: [
      {
        message:
          "마지막으로, 바쁜 일상 속에서도 습관을 잊지 않게 물보라를 뿜어 신호를 보내줄게.",
        onOk: async () => {
          await completeWithHomePreview();
        },
      },
    ],
  });

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    void run();
  }, [run]);

  return (
    <OnboardStepLayout stepName="notification">
      <View className="flex-1">
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingTop: 36 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={12}
          extraKeyboardSpace={8}
        >
          <ChatBubbleList>
            {messages.map((v, i) => (
              <ChatBubble
                key={`onboard-step-name${i}`}
                showTyping={v.type === "typing"}
                message={v.message ?? ""}
                side={v.role === "system" ? "left" : "right"}
              />
            ))}
          </ChatBubbleList>
        </KeyboardAwareScrollView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepNotification;

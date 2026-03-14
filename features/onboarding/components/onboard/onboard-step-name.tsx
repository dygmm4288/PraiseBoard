import { BoardSetupFormValues } from "@/entities/board/board.schema";
import { toast } from "@/shared/toasts/toast";
import { useEffect } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { validateBeforeNext } from "../../hooks/useOnboardingSetupForm";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatInput from "../chat/chat-input";
import OnboardStepLayout from "./onboard-step-layout";

const OnboardStepName = ({ form, onNext }: OnboardStepProps) => {
  const { messages, addUserMessage, run, disabled } = useOnboardChat({
    whaleMessages: [
      {
        message: "안녕하세요! 저는 칭찬고래 두잉이에요.🐳",
      },
      {
        message: "당신의 이름은 무엇인가요?",
        userDisabled: false,
      },
    ],
  });

  const onSendForm = async (
    field: ControllerRenderProps<BoardSetupFormValues, "profiles.nickname">,
  ) => {
    const nickname = (field.value ?? "").trim();

    const error = await validateBeforeNext(form, {
      fields: "profiles.nickname",
      shouldFocus: true,
    });

    if (error) {
      toast.chatError(error);
      return;
    }

    form.clearErrors("profiles.nickname");
    field.onChange("");
    await addUserMessage(nickname);
    onNext();
    field.onChange(nickname);
  };

  useEffect(() => {
    run();
  }, []);

  return (
    <OnboardStepLayout stepName="name">
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
              <ChatBubble
                key={`onboard-step-name${i}`}
                showTyping={v.type === "typing"}
                message={v.message ?? ""}
                side={v.role === "system" ? "left" : "right"}
              />
            ))}
          </ChatBubbleList>
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
                <View className="gap-2">
                  <ChatInput
                    placeholder="이름을 알려주세요"
                    value={field.value}
                    onChangeText={field.onChange}
                    onSend={() => onSendForm(field)}
                    disabled={disabled}
                  />
                </View>
              )}
            />
          </View>
        </KeyboardStickyView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepName;

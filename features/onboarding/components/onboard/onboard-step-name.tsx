import {
  BoardSetupFormValues,
  NICKNAME_MAX_LENGTH,
  boardSetupDraftSchema,
} from "@/entities/board/board.schema";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import sleep from "@/shared/utils/sleep";
import { useEffect } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatInput from "../chat/chat-input";
import OnboardStepLayout from "./onboard-step-layout";

const nicknameSchema = boardSetupDraftSchema.shape.profiles.shape.nickname;

const OnboardStepName = ({ form, onSend }: OnboardStepProps) => {
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

  useEffect(() => {
    const run = async () => {
      await sleep(1200);
      toast.error("toast message");
    };
    run();
  }, []);

  const onSendForm = async (
    field: ControllerRenderProps<BoardSetupFormValues, "profiles.nickname">,
  ) => {
    const nickname = (field.value ?? "").trim();
    if (!nickname) {
      form.setError("profiles.nickname", {
        type: "manual",
        message: "이름을 입력해 주세요.",
      });
      return;
    }

    if (nickname.length > NICKNAME_MAX_LENGTH) {
      form.setError("profiles.nickname", {
        type: "manual",
        message: `닉네임은 ${NICKNAME_MAX_LENGTH}자 이하로 입력해 주세요.`,
      });
      // TODO: 토스트 추가 시 이 지점에서 교체
      return;
    }

    const parsedNickname = nicknameSchema.safeParse(nickname);
    if (!parsedNickname.success) {
      form.setError("profiles.nickname", {
        type: "manual",
        message:
          parsedNickname.error.issues[0]?.message ??
          "올바른 이름을 입력해 주세요.",
      });
      return;
    }

    form.clearErrors("profiles.nickname");
    field.onChange("");
    await addUserMessage(nickname);
    await onSend();
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
              render={({ field, fieldState }) => (
                <View className="gap-2">
                  <ChatInput
                    placeholder="이름을 알려주세요"
                    value={field.value}
                    onChangeText={field.onChange}
                    onSend={() => onSendForm(field)}
                    disabled={disabled}
                  />
                  {/* dev 용 */}
                  {fieldState.error?.message ? (
                    <AppText variant="caption1" className="px-2 text-red-500">
                      {fieldState.error.message}
                    </AppText>
                  ) : null}
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

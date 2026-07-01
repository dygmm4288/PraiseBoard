import { BoardSetupFormValues, NICKNAME_MAX_LENGTH } from "@/features/board";
import { useCallback, useEffect, useState } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import useOnboardActionLock from "../../hooks/use-onboard-action-lock";
import useOnboardChat from "../../hooks/use-onboard-chat";
import useOnboardInputError from "../../hooks/use-onboard-input-error";
import { validateBeforeNext } from "../../hooks/use-onboarding-setup-form";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatInput from "../chat/chat-input";
import OnboardChatStepLayout from "./onboard-chat-step-layout";

const OnboardStepName = ({ form, onNext }: OnboardStepProps) => {
  const [canInput, setCanInput] = useState(false);
  const actionLock = useOnboardActionLock();
  const { inputError, showInputError, hideInputError } = useOnboardInputError();
  const showMaxLengthError = useCallback(() => {
    showInputError("이름은 15자까지 입력할 수 있어요");
  }, [showInputError]);

  const { messages, addUserMessage, run, disabled } = useOnboardChat({
    whaleMessages: [
      {
        message: "안녕! 나는 칭찬고래 두잉이야.\n너의 이름은 뭐야?",
        userDisabled: false,
        onOk: () => setCanInput(true),
      },
    ],
  });

  const onSendForm = actionLock.guard(
    async (
      field: ControllerRenderProps<BoardSetupFormValues, "profiles.nickname">,
    ) => {
      const nickname = (field.value ?? "").trim();

      const error = await validateBeforeNext(form, {
        fields: "profiles.nickname",
        shouldFocus: true,
      });

      if (error) {
        actionLock.reset();
        showInputError(error);
        return;
      }

      hideInputError();
      form.clearErrors("profiles.nickname");
      field.onChange("");
      await addUserMessage(nickname);
      onNext();
      field.onChange(nickname);
    },
  );

  useEffect(() => {
    run();
  }, []);

  return (
    <OnboardChatStepLayout
      inputError={inputError}
      footer={
        <Controller
          name="profiles.nickname"
          control={form.control}
          render={({ field }) => (
            <ChatInput
              placeholder="이름을 알려주세요"
              value={field.value}
              onChangeText={field.onChange}
              onSend={() => onSendForm(field)}
              disabled={disabled || !canInput || actionLock.disabled}
              maxLength={NICKNAME_MAX_LENGTH}
              onMaxLengthExceeded={showMaxLengthError}
              autoFocus={canInput}
              focusTrigger={canInput}
            />
          )}
        />
      }
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
    </OnboardChatStepLayout>
  );
};

export default OnboardStepName;

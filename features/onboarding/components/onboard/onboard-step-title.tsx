import { BoardSetupFormValues, TITLE_MAX_LENGTH } from "@/features/board";
import { toast } from "@/shared/toasts/toast";
import { useCallback, useEffect, useState } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import useOnboardActionLock from "../../hooks/use-onboard-action-lock";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { validateBeforeNext } from "../../hooks/use-onboarding-setup-form";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatInput from "../chat/chat-input";
import OnboardSelectList, { OnboardSelectListItem } from "./onboard-select-list";
import OnboardStepLayout from "./onboard-step-layout";

const CHIPS = [
  { icon: "🥛", text: "아침에 물 한 잔" },
  { icon: "📖", text: "독서하기" },
  { icon: "🎸", text: "악기 연주하기" },
  { icon: "🪴", text: "화분 물주기" },
  { icon: "💼", text: "칼퇴하기" },
  { icon: "✍️", text: "직접 입력하기", value: null },
];
const OnboardStepTitle = ({ form, onNext }: OnboardStepProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isDirectMode, setIsDirectMode] = useState(false);
  const actionLock = useOnboardActionLock();
  const showMaxLengthToast = useCallback(() => {
    toast.chatError("보드 제목은 15자까지 입력할 수 있어요", {
      refresh: true,
    });
  }, []);

  const { messages, addUserMessage, run, disabled } = useOnboardChat({
    whaleMessages: [
      {
        message:
          `반가워, ${form.getValues("profiles.nickname")}!\n첫번째 습관을 정하기 위해 준비가 필요해. 무엇을 먼저 시작해보고 싶어?`,
        userDisabled: false,
        onOk: () => setShowOptions(true),
      },
    ],
  });

  const onSelectOption = actionLock.guard(async (item: OnboardSelectListItem) => {
    setShowOptions(false);

    if (item.value === null) {
      await addUserMessage(item.text, { runNext: false });
      setIsDirectMode(true);
      form.setValue("boards.emoji", "🌱");
      actionLock.reset();
      return;
    }

    await addUserMessage(item.text);
    form.setValue("boards.title", item.text);
    form.setValue("boards.emoji", item.icon);
    onNext();
  });

  const onSendForm = actionLock.guard(
    async (field: ControllerRenderProps<BoardSetupFormValues, "boards.title">) => {
      const title = (field.value ?? "").trim();
      const error = await validateBeforeNext(form, {
        fields: "boards.title",
        shouldFocus: true,
      });
      if (error) {
        actionLock.reset();
        toast.chatError(error);
        return;
      }
      form.clearErrors("boards.title");
      field.onChange("");
      await addUserMessage(title);
      form.setValue("boards.emoji", "🌱");
      onNext();
      field.onChange(title);
    },
  );

  useEffect(() => {
    run();
  }, []);

  return (
    <OnboardStepLayout stepName="title">
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
              <View key={`onboard-step-name${i}`}>
                <ChatBubble
                  showTyping={v.type === "typing"}
                  message={v.message ?? ""}
                  side={v.role === "system" ? "left" : "right"}
                />
                {showOptions && v.role === "system" && i === 0 && (
                  <View className="mt-[24px]">
                    <OnboardSelectList
                      items={CHIPS}
                      onPress={onSelectOption}
                      disabled={actionLock.disabled}
                    />
                  </View>
                )}
              </View>
            ))}
          </ChatBubbleList>
        </KeyboardAwareScrollView>
        <KeyboardStickyView
          offset={{ closed: 0, opened: 0 }}
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <View className="bg-white py-[8px]">
            <Controller
              name="boards.title"
              control={form.control}
              render={({ field }) => (
                isDirectMode ? <ChatInput
                  placeholder="보드 제목을 알려주세요"
                  value={field.value}
                  onChangeText={field.onChange}
                  disabled={disabled || actionLock.disabled}
                  onSend={() => onSendForm(field)}
                  maxLength={TITLE_MAX_LENGTH}
                  onMaxLengthExceeded={showMaxLengthToast}
                /> : <></>
              )}
            />
          </View>
        </KeyboardStickyView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepTitle;

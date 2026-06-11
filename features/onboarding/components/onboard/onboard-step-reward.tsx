import {
  BoardSetupFormValues,
  REWARD_MEMO_LENGTH,
} from "@/features/board/schema";
import { toast } from "@/shared/toasts/toast";
import sleep from "@/shared/utils/sleep";
import { Fragment, useEffect, useState } from "react";
import { Controller, ControllerRenderProps } from "react-hook-form";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { validateBeforeNext } from "../../hooks/use-onboarding-setup-form";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatInput from "../chat/chat-input";
import OnboardSelectList, {
  OnboardSelectListItem,
} from "./onboard-select-list";
import OnboardStepLayout from "./onboard-step-layout";

const CHIPS = [
  { icon: "🍗", text: "치팅데이" },
  { icon: "📚", text: "나에게 책 선물" },
  { icon: "🎸", text: "악기 부품 장만" },
  { icon: "🪴", text: "새로운 화분 구매" },
  { icon: "✍️", text: "직접 입력하기", value: null },
  { icon: "🫥", text: "보상 비워두기", value: "" },
];
const OnboardStepReward = ({ form, onNext }: OnboardStepProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isDirectMode, setIsDirectMode] = useState(false);
  const { messages, addUserMessage, run, disabled } = useOnboardChat({
    whaleMessages: [
      {
        message: "만약 100% 다 달성하면 스스로에게 어떤 보상을 주고 싶어?",
        userDisabled: false,
        onOk: () => setShowOptions(true),
        waitUser: true,
      },
      {
        message: () => {
          return form.getValues("boards.reward_memo") !== null
            ? "우와! 벌써 선물을 받은 네 모습이 상상돼.\n함께 열심히 해보자."
            : "지금 생각나지 않아도 괜찮아!\n나중에 언제든 입력할 수 있어.";
        },
        async onOk() {
          await sleep(1200);
          onNext();
        },
      },
    ],
  });

  useEffect(() => {
    run();
  }, []);

  const onSendForm = async (
    field: ControllerRenderProps<BoardSetupFormValues, "boards.reward_memo">,
  ) => {
    const rewardMemo = (field.value ?? "").trim();

    const error = await validateBeforeNext(form, {
      fields: "boards.reward_memo",
      shouldFocus: true,
    });

    if (error) {
      toast.chatError(error);
      return;
    }

    form.clearErrors("boards.reward_memo");
    field.onChange("");
    form.setValue("boards.reward_memo", rewardMemo);
    await addUserMessage(rewardMemo);
    field.onChange(rewardMemo);
  };

  const onSelectOption = async (item: OnboardSelectListItem) => {
    setShowOptions(false);

    if (item.value === null) {
      await addUserMessage(item.text, { runNext: false });
      setIsDirectMode(true);
      return;
    }

    const rewardMemo = item.value === "" ? null : item.text;
    form.setValue("boards.reward_memo", rewardMemo);
    await addUserMessage(item.text);
  };

  return (
    <OnboardStepLayout stepName="reward">
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
              <Fragment key={`onboard-step-name${i}`}>
                <ChatBubble
                  showTyping={v.type === "typing"}
                  message={v.message ?? ""}
                  side={v.role === "system" ? "left" : "right"}
                />
                {showOptions && v.role === "system" && i === 0 && (
                  <View className="mt-[24px]">
                    <OnboardSelectList items={CHIPS} onPress={onSelectOption} />
                  </View>
                )}
              </Fragment>
            ))}
          </ChatBubbleList>
        </KeyboardAwareScrollView>
        <KeyboardStickyView
          offset={{ closed: 0, opened: 0 }}
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <View className="bg-white py-[8px]">
            <Controller
              name="boards.reward_memo"
              control={form.control}
              render={({ field }) => (
                <View className="gap-2">
                  {isDirectMode && (
                    <ChatInput
                      placeholder="보상을 알려주세요"
                      value={field.value || ""}
                      onChangeText={field.onChange}
                      onSend={() => onSendForm(field)}
                      disabled={disabled}
                      maxLength={REWARD_MEMO_LENGTH}
                    />
                  )}
                </View>
              )}
            />
          </View>
        </KeyboardStickyView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepReward;

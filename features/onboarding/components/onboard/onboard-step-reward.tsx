import { BoardSetupFormValues } from "@/entities/board/board.schema";
import { toast } from "@/shared/toasts/toast";
import { AppText } from "@/shared/ui";
import sleep from "@/shared/utils/sleep";
import { Fragment, useEffect, useState } from "react";
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
import ChatChip from "../chat/chat-chip";
import ChatInput from "../chat/chat-input";
import OnboardStepLayout from "./onboard-step-layout";

const CHIPS = [
  { icon: "📚", text: "나에게 책 선물" },
  { icon: "🍗", text: "치팅데이" },
  { icon: "🪴", text: "새로운 화분 구매" },
  { icon: "🎸", text: "악기 부품 장만" },
  { icon: "🐳", text: "기부하기" },
  { icon: "🫥", text: "보상 비워두기" },
];
const OnboardStepReward = ({ form, onNext }: OnboardStepProps) => {
  const [showChips, setShowChips] = useState(false);
  const { messages, addUserMessage, run, disabled } = useOnboardChat({
    whaleMessages: [
      {
        message:
          "구슬을 다 모아 병이 차면, 스스로에게 어떤 선물을 주고 싶어요?",
      },
      {
        message: "상상만 해도 기분이 좋아지는 걸 적어주세요.",
        onOk: () => setShowChips(true),
        waitUser: true,
      },
      {
        message: () => {
          console.log("@@@ message", form.getValues("boards.reward_memo"));
          return form.getValues("boards.reward_memo") !== null
            ? `우와~ 벌써 선물을 받은 ${form.getValues("boards.reward_memo")}님이 상상되네요.함께 열심히 구슬을 모아봐요. 🔮선물 변경을 원하면, 설정에서 언제든 변경할 수 있어요.`
            : "지금 생각나지 않아도 괜찮아요~ 다음에 생각나면 설정에서 ‘선물’을 언제든 입력할 수 있어요. 📝";
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
    await addUserMessage(rewardMemo);
    onNext();
    field.onChange(rewardMemo);
  };

  const Chips = () =>
    CHIPS.map((props) => (
      <ChatChip
        key={props.icon}
        {...props}
        onPress={async () => {
          const rewardMemo = props.text !== "보상 비워두기" ? props.text : null;
          form.setValue("boards.reward_memo", rewardMemo);
          await addUserMessage(props.text);
        }}
      />
    ));

  return (
    <OnboardStepLayout stepName="reward">
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
              <Fragment key={`onboard-step-name${i}`}>
                <ChatBubble
                  showTyping={v.type === "typing"}
                  message={v.message ?? ""}
                  side={v.role === "system" ? "left" : "right"}
                />
                {/* TODO 조건 수정 */}
                {showChips && v.role === "system" && i === 1 && (
                  <View className="mt-[40px] flex flx-col justify-center gap-[10px]">
                    <>
                      <AppText
                        variant="caption1"
                        className="text-gray-400 text-center"
                      >
                        직접 입력하거나 아래에서 선택해도 좋아요!
                      </AppText>
                      <View className="w-full flex-row flex-wrap items-center justify-center gap-[6px]">
                        <Chips />
                      </View>
                    </>
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
                  <ChatInput
                    placeholder="이름을 알려주세요"
                    value={field.value || ""}
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

export default OnboardStepReward;

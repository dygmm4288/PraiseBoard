import { Fragment, useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useOnboardActionLock from "../../hooks/use-onboard-action-lock";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import OnboardSelectList, {
  OnboardSelectListItem,
} from "./onboard-select-list";
import OnboardStepLayout from "./onboard-step-layout";

const CHIPS = [
  { icon: "1️⃣", text: "1번", value: "1" },
  { icon: "2️⃣", text: "2번", value: "2" },
  { icon: "3️⃣", text: "3번", value: "3" },
  { icon: "4️⃣", text: "4번", value: "4" },
  { icon: "5️⃣", text: "5번", value: "5" },
];

const OnboardStepCount = ({ form, onNext }: OnboardStepProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const actionLock = useOnboardActionLock();

  const { messages, addUserMessage, run } = useOnboardChat({
    whaleMessages: [
      {
        message:
          "그럼 하루에 최대 몇 번까지 할 수 있을 것 같아? 방금 정한 목표 개수를 며칠에 걸쳐 나눌지 생각해봐.",
        onOk: () => setShowOptions(true),
      },
    ],
  });

  useEffect(() => {
    run();
  }, []);

  const onSelectOption = actionLock.guard(async (item: OnboardSelectListItem) => {
    setShowOptions(false);
    await addUserMessage(item.text);
    form.setValue("boards.limit_count", Number(item.value!));
    onNext();
  });

  return (
    <OnboardStepLayout stepName="limitCount">
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
              <Fragment key={`onboard-step-count${i}`}>
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
              </Fragment>
            ))}
          </ChatBubbleList>
        </KeyboardAwareScrollView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepCount;

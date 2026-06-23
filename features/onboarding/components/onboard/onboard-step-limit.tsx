import { Fragment, useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import useOnboardChat from "../../hooks/use-onboard-chat";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import OnboardSelectList, {
  OnboardSelectListItem,
} from "./onboard-select-list";

const CHIPS = [
  { icon: "🌟", text: "30개", value: "30" },
  { icon: "🔥", text: "50개", value: "50" },
  { icon: "💯", text: "100개", value: "100" },
];

const OnboardStepLimit = ({ form, onNext }: OnboardStepProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const { messages, addUserMessage, run } = useOnboardChat({
    whaleMessages: [
      {
        message: "원하는 목표 개수를 골라줘.\n너가 원하는 속도에 맞춰보자.",
        onOk: () => setShowOptions(true),
      },
    ],
  });

  useEffect(() => {
    run();
  }, []);

  const onSelectOption = async (item: OnboardSelectListItem) => {
    setShowOptions(false);
    await addUserMessage(item.text);
    form.setValue("boards.target_count", item.value ?? item.text);
    onNext();
  };

  return (
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
    </View>
  );
};

export default OnboardStepLimit;

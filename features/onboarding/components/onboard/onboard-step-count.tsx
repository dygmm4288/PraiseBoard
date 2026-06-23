import { Fragment, useEffect, useMemo, useState } from "react";
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

const DAILY_LIMIT_OPTIONS = [
  { icon: "1️⃣", value: 1 },
  { icon: "2️⃣", value: 2 },
  { icon: "3️⃣", value: 3 },
  { icon: "4️⃣", value: 4 },
  { icon: "5️⃣", value: 5 },
];

const OnboardStepCount = ({ form, onNext }: OnboardStepProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const actionLock = useOnboardActionLock();
  const targetCount = Number(form.watch("boards.target_count"));
  const safeTargetCount = [30, 50, 100].includes(targetCount)
    ? targetCount
    : 30;
  const chips = useMemo(
    () =>
      DAILY_LIMIT_OPTIONS.map(({ icon, value }) => ({
        icon,
        text: `${value}번·${Math.ceil(safeTargetCount / value)}일`,
        value: String(value),
      })),
    [safeTargetCount],
  );

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

  const onSelectOption = actionLock.guard(
    async (item: OnboardSelectListItem) => {
      setShowOptions(false);
      await addUserMessage(item.text);
      form.setValue("boards.limit_count", Number(item.value!));
      onNext();
    },
  );

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
            <Fragment key={`onboard-step-count${i}`}>
              <ChatBubble
                showTyping={v.type === "typing"}
                message={v.message ?? ""}
                side={v.role === "system" ? "left" : "right"}
              />
              {showOptions && v.role === "system" && i === 0 && (
                <View className="mt-[24px]">
                  <OnboardSelectList
                    items={chips}
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
  );
};

export default OnboardStepCount;

import { Controller } from "react-hook-form";
import { View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import ChatInput from "../chat/chat-input";
import OnboardStepLayout from "./onboard-step-layout";

const OnboardStepName = ({ form, onSend }: OnboardStepProps) => {
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
            <ChatBubble message="안녕하세요! 저는 칭찬고래 두잉이에요.🐳" />
            <ChatBubble message="당신의 이름은 무엇인가요?" />
          </ChatBubbleList>
        </KeyboardAwareScrollView>
        <KeyboardStickyView offset={{ closed: 0, opened: 0 }}>
          <Controller
            name="profiles.nickname"
            control={form.control}
            render={({ field }) => (
              <ChatInput
                placeholder="이름을 알려주세요"
                value={field.value}
                onChangeText={field.onChange}
                onSend={onSend}
              />
            )}
          />
        </KeyboardStickyView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepName;

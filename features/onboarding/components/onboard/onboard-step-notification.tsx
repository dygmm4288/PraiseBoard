import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import ChatBubbleList from "../chat/chat-bubble-list";
import OnboardStepLayout from "./onboard-step-layout";

const OnboardStepNotification = ({ form, onSend }: OnboardStepProps) => {
  return (
    <OnboardStepLayout stepName="notification">
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
            <ChatBubble
              message="바쁜 일상 속에서도 구슬 모으는 걸 잊지 않게
물보라를 뿜어 신호를 보내줄게요. 푸우~🐳"
            />
            <ChatBubble
              message="#{알림을 허용해주세요.
동의하지 않아도 앱 사용이 가능합니다.}"
            />
          </ChatBubbleList>
        </KeyboardAwareScrollView>
      </View>
    </OnboardStepLayout>
  );
};

export default OnboardStepNotification;

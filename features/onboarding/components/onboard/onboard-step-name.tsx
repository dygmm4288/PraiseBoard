import AppInputButton from "@/shared/components/InputButton";
import { Controller } from "react-hook-form";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";
import OnboardStepLayout from "./onboard-step-layout";

const OnboardStepName = ({ form, onPress }: OnboardStepProps) => {
  return (
    <OnboardStepLayout>
      <ChatBubble message="난 항상 네 편이 되어주고 싶어" />
      <ChatBubble message="네 이름은 뭐야?" />
      <Controller
        name="profiles.nickname"
        control={form.control}
        render={({ field }) => (
          <AppInputButton
            value={field.value}
            onChangeValue={field.onChange}
            onPress={onPress}
            buttonProps={{
              label: "다음",
            }}
          />
        )}
      />
    </OnboardStepLayout>
  );
};

export default OnboardStepName;

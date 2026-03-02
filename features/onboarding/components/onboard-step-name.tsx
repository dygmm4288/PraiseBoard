import { AppChatBubble } from "@/shared/components/ui";
import OnboardStepLayout from "./onboard-step-layout";

const OnboardStepName = () => {
  return (
    <OnboardStepLayout>
      <AppChatBubble message="난 항상 네 편이 되어주고 싶어" />
      <AppChatBubble message="네 이름은 뭐야?" />
    </OnboardStepLayout>
  );
};

export default OnboardStepName;

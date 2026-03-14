import { images } from "@/assets/images";
import sleep from "@/shared/utils/sleep";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { OnboardStepProps } from "../../types/onboard-step.type";
import { ChatBubble } from "../chat/chat-bubble";

const OnboardStepIntro = ({ form, onNext }: OnboardStepProps) => {
  useEffect(() => {
    const run = async () => {
      await sleep(1500);
      onNext();
    };

    run();
  }, []);

  return (
    <View className="flex-1 flex-col justify-center items-center gap-[24px]">
      <Image source={images.illustrations.onboardWhale} />
      <ChatBubble side="center" message="안녕! 나는 칭찬고래 두잉이야. 🐳" />
    </View>
  );
};

export default OnboardStepIntro;

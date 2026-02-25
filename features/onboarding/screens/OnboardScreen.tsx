import { onboardImages } from "@/assets/images";
import { Stepper } from "@/shared/components/flow";
import { AppChatBubble } from "@/shared/components/ui";
import { Image, View } from "react-native";

const OnboardScreen = () => {
  const steps = [
    { label: "intro", value: "intro0" },
    { label: "intro1", value: "intro1" },
    { label: "name", value: "name" },
    { label: "title", value: "title" },
    { label: "limit", value: "limit" },
    { label: "reward", value: "reward" },
  ];

  const isIntroSteps = (step: string) => step.startsWith("intro");

  return (
    <Stepper steps={steps} defaultValue="intro0">
      {({ currentValue, currentIndex }) => (
        <View className="flex-1">
          {isIntroSteps(currentValue) && (
            <View className="flex-1 items-center justify-center gap-lg">
              <Image
                source={onboardImages[currentIndex]}
                resizeMode="contain"
                className="h-[180px] w-[180px]"
              />
              {currentValue === "intro1" && (
                <AppChatBubble side="center" message="안녕, 나는 칭찬고래야" />
              )}
            </View>
          )}
        </View>
      )}
    </Stepper>
  );
};

export default OnboardScreen;

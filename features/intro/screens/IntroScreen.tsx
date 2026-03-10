import { useUser } from "@/services/user";
import { Stepper } from "@/shared/components";
import { AppButton } from "@/shared/ui";
import { useRouter } from "expo-router";
import { View } from "react-native";
import IntroContent from "../components/intro-content";
import IntroPageLayout from "../components/intro-page-layout";

export const INTRO_STEP_VALUES = ["intro0", "intro1"] as const;
export type IntroStepValue = (typeof INTRO_STEP_VALUES)[number];

const INTRO_STEPS = INTRO_STEP_VALUES.map((value) => ({ label: value, value }));

type IntroScreenContentProps = {
  defaultStep?: IntroStepValue;
  onComplete: () => Promise<void> | void;
};

export const IntroScreenContent = ({
  defaultStep = "intro0",
  onComplete,
}: IntroScreenContentProps) => {
  return (
    <Stepper steps={INTRO_STEPS} defaultValue={defaultStep}>
      {({ currentValue, currentIndex, direction, next }) => (
        <IntroPageLayout
          currentValue={currentValue}
          direction={direction}
          visual={<View className="w-full h-[480px] bg-gray-200"></View>}
          footer={
            <AppButton
              fullWidth
              variant={currentIndex === 0 ? "tertiary" : undefined}
              label={currentIndex === 0 ? "다음" : "시작하기"}
              onPress={async () => {
                const isLastStep = currentIndex === INTRO_STEPS.length - 1;

                if (isLastStep) {
                  await onComplete();
                  return;
                }

                next();
              }}
            />
          }
        >
          <IntroContent currentIndex={currentIndex} />
        </IntroPageLayout>
      )}
    </Stepper>
  );
};

const IntroScreen = () => {
  const { completeIntro } = useUser();
  const router = useRouter();
  const handleComplete = async () => {
    await completeIntro();
    router.replace("/onboard");
  };

  return <IntroScreenContent onComplete={handleComplete} />;
};

export default IntroScreen;

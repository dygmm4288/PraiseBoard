import { useUser } from "@/features/user-service/UserProvider";
import { IntroPageLayout, Stepper } from "@/shared/components";
import { AppButton } from "@/shared/components/ui";
import { useRouter } from "expo-router";
import IntroContent from "../components/intro-content";

const IntroScreen = () => {
  const { completeIntro } = useUser();
  const router = useRouter();
  const steps = [
    { label: "intro0", value: "intro0" },
    { label: "intro1", value: "intro1" },
  ];

  const handleComplete = async (currentValue: string, next: () => void) => {
    const isLastStep = currentValue === steps[steps.length - 1]?.value;

    if (isLastStep) {
      await completeIntro();
      router.replace("/onboard");
      return;
    }

    next();
  };

  return (
    <Stepper steps={steps} defaultValue="intro0">
      {({ currentValue, currentIndex, direction, next }) => (
        <IntroPageLayout
          currentValue={currentValue}
          direction={direction}
          visual={null}
          footer={
            <>
              <AppButton
                fullWidth
                variant={currentIndex === 0 ? "outline" : undefined}
                label={currentIndex === 0 ? "다음" : "시작하기"}
                onPress={() => handleComplete(currentValue, next)}
              />
            </>
          }
        >
          <IntroContent currentIndex={currentIndex} />
        </IntroPageLayout>
      )}
    </Stepper>
  );
};

export default IntroScreen;

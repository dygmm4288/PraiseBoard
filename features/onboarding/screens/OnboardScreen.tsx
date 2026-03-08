import { onboardImages } from "@/assets/images";
import { Stepper } from "@/shared/components";
import { AppButton, AppChatBubble } from "@/shared/components/ui";
import { FormProvider } from "react-hook-form";
import { Image, View } from "react-native";
import OnboardStepName from "../components/onboard-step-name";
import OnboardStepTitle from "../components/onboard-step-title";
import useOnboardingSetupForm from "../hooks/useOnboardingSetupForm";
import { steps } from "../onboarding.steps";

const OnboardScreen = () => {
  const { form, validateBeforeNext } = useOnboardingSetupForm();

  const isIntroSteps = (step: string) => step.startsWith("intro");

  return (
    <FormProvider {...form}>
      <Stepper steps={steps as any} defaultValue="intro0">
        {({ currentValue, currentIndex, next }) => (
          <View className="flex-1">
            {isIntroSteps(currentValue) && (
              <View className="flex-1 items-center justify-center gap-lg">
                <Image
                  source={onboardImages[currentIndex]}
                  resizeMode="contain"
                  className="h-[180px] w-[180px]"
                />
                {currentValue === "intro1" && (
                  <AppChatBubble
                    side="center"
                    message="안녕, 나는 칭찬고래야"
                  />
                )}
                <AppButton label="dev test" onPress={next} />
              </View>
            )}
            {currentValue === "name" && (
              <OnboardStepName
                form={form}
                onPress={async () => {
                  const ok = await validateBeforeNext({
                    fields: "profiles.nickname",
                  });
                  if (ok) next();
                }}
              />
            )}
            {currentValue === "title" && (
              <OnboardStepTitle
                form={form}
                onPress={async () => {
                  const ok = await validateBeforeNext({
                    fields: "boards.title",
                  });
                  if (ok) next();
                }}
              ></OnboardStepTitle>
            )}
          </View>
        )}
      </Stepper>
    </FormProvider>
  );
};

export default OnboardScreen;

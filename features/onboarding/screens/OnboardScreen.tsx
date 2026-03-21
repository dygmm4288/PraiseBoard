import { Stepper } from "@/shared/components";
import { Screen } from "@/shared/ui";
import { FormProvider } from "react-hook-form";
import { View } from "react-native";
import OnboardStepIntro from "../components/onboard/onboard-step-intro";
import OnboardStepLimit from "../components/onboard/onboard-step-limit";
import OnboardStepName from "../components/onboard/onboard-step-name";
import OnboardStepNotification from "../components/onboard/onboard-step-notification";
import OnboardStepReward from "../components/onboard/onboard-step-reward";
import OnboardStepTitle from "../components/onboard/onboard-step-title";
import useOnboardingSetupForm from "../hooks/useOnboardingSetupForm";
import { steps } from "../onboarding.steps";

const OnboardScreen = () => {
  const { form } = useOnboardingSetupForm();


  return (
    <Screen>
      <FormProvider {...form}>
        <Stepper steps={steps as any} defaultValue="intro">
          {({ currentValue, next }) => (
            <View className="flex-1">
              {currentValue === "intro" && (
                <OnboardStepIntro form={form} onNext={next} />
              )}
              {currentValue === "name" && (
                <OnboardStepName form={form} onNext={next} />
              )}
              {currentValue === "title" && (
                <OnboardStepTitle form={form} onNext={next} />
              )}
              {currentValue === "reward" && (
                <OnboardStepReward form={form} onNext={next} />
              )}
              {currentValue === "limit" && (
                <OnboardStepLimit form={form} onNext={next} />
              )}
              {currentValue === "notification" && (
                <OnboardStepNotification form={form} onNext={next} />
              )}
            </View>
          )}
        </Stepper>
      </FormProvider>
    </Screen>
  );
};

export default OnboardScreen;

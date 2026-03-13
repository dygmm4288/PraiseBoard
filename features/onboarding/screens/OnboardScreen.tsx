import { Stepper } from "@/shared/components";
import { Screen } from "@/shared/ui";
import { FormProvider } from "react-hook-form";
import { View } from "react-native";
import OnboardStepLimit from "../components/onboard/onboard-step-limit";
import OnboardStepName from "../components/onboard/onboard-step-name";
import OnboardStepNotification from "../components/onboard/onboard-step-notification";
import OnboardStepReward from "../components/onboard/onboard-step-reward";
import OnboardStepTitle from "../components/onboard/onboard-step-title";
import useOnboardingSetupForm from "../hooks/useOnboardingSetupForm";
import { steps } from "../onboarding.steps";
import OnboardStepIntro from "../components/onboard/onboard-step-intro";

const OnboardScreen = () => {
  const { form, validateBeforeNext } = useOnboardingSetupForm();

  return (
    <Screen>
      <FormProvider {...form}>
        <Stepper steps={steps as any} defaultValue="intro">
          {({ currentValue, next }) => (
            <View className="flex-1">
              {currentValue === "intro" && (
                <OnboardStepIntro
                  form={form}
                  onSend={async () => {
                    next();
                  }}
                />
              )}
              {currentValue === "name" && (
                <OnboardStepName
                  form={form}
                  onSend={async () => {
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
                  onSend={async () => {
                    const ok = await validateBeforeNext({
                      fields: "boards.title",
                    });
                    if (ok) next();
                  }}
                />
              )}
              {currentValue === "reward" && (
                <OnboardStepReward
                  form={form}
                  onSend={async () => {
                    const ok = await validateBeforeNext({
                      fields: "boards.title",
                    });
                    if (ok) next();
                  }}
                />
              )}
              {currentValue === "limit" && (
                <OnboardStepLimit
                  form={form}
                  onSend={async () => {
                    const ok = await validateBeforeNext({
                      fields: "boards.title",
                    });
                    if (ok) next();
                  }}
                />
              )}
              {currentValue === "notification" && (
                <OnboardStepNotification
                  form={form}
                  onSend={async () => {
                    const ok = await validateBeforeNext({
                      fields: "boards.title",
                    });
                    if (ok) next();
                  }}
                />
              )}
            </View>
          )}
        </Stepper>
      </FormProvider>
    </Screen>
  );
};

export default OnboardScreen;

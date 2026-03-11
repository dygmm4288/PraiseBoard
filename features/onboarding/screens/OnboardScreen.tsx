import { Stepper } from "@/shared/components";
import { Screen } from "@/shared/ui";
import { FormProvider } from "react-hook-form";
import { View } from "react-native";
import OnboardStepName from "../components/onboard/onboard-step-name";
import OnboardStepTitle from "../components/onboard/onboard-step-title";
import useOnboardingSetupForm from "../hooks/useOnboardingSetupForm";
import { steps } from "../onboarding.steps";

const OnboardScreen = () => {
  const { form, validateBeforeNext } = useOnboardingSetupForm();

  return (
    <Screen>
      <FormProvider {...form}>
        <Stepper steps={steps as any} defaultValue="title">
          {({ currentValue, currentIndex, next }) => (
            <View className="flex-1">
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
                ></OnboardStepTitle>
              )}
            </View>
          )}
        </Stepper>
      </FormProvider>
    </Screen>
  );
};

export default OnboardScreen;

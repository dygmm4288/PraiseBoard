import {
  BOARD_SETUP_DEFAULT_VALUES,
  type BoardSetupFormValues,
} from "@/features/board";
import { Stepper } from "@/shared/components";
import { Screen } from "@/shared/ui";
import { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import { View } from "react-native";
import OnboardHeader from "../components/onboard/onboard-header";
import { OnboardHeaderBoundary } from "../components/onboard/onboard-step-layout";
import OnboardStepLimit from "../components/onboard/onboard-step-limit";
import OnboardStepName from "../components/onboard/onboard-step-name";
import OnboardStepNotification from "../components/onboard/onboard-step-notification";
import OnboardStepReward from "../components/onboard/onboard-step-reward";
import OnboardStepTitle from "../components/onboard/onboard-step-title";
import useOnboardingSetupForm from "../hooks/use-onboarding-setup-form";
import { steps, type STEPS } from "../onboarding.steps";
import type { OnboardStepProps } from "../types/onboard-step.type";
import OnboardStepCount from "../components/onboard/onboard-step-count";

export const ONBOARD_STEP_VALUES = steps.map((step) => step.value) as STEPS[];

type OnboardScreenInitialValues = {
  boards?: Partial<BoardSetupFormValues["boards"]>;
  profiles?: Partial<BoardSetupFormValues["profiles"]>;
};

type OnboardScreenContentProps = {
  defaultStep?: STEPS;
  initialValues?: OnboardScreenInitialValues;
  renderNotificationStep?: (props: OnboardStepProps) => ReactNode;
};

const buildInitialValues = (
  initialValues?: OnboardScreenInitialValues,
): BoardSetupFormValues => ({
  boards: {
    ...BOARD_SETUP_DEFAULT_VALUES.boards,
    ...initialValues?.boards,
  },
  profiles: {
    ...BOARD_SETUP_DEFAULT_VALUES.profiles,
    ...initialValues?.profiles,
  },
});

export const OnboardScreenContent = ({
  defaultStep = "name",
  initialValues,
  renderNotificationStep,
}: OnboardScreenContentProps) => {
  const { form } = useOnboardingSetupForm(buildInitialValues(initialValues));

  return (
    <Screen>
      <FormProvider {...form}>
        <Stepper steps={steps as any} defaultValue={defaultStep}>
          {({ currentValue, next }) => (
            <OnboardHeaderBoundary>
              <View className="flex-1">
                <OnboardHeader stepName={currentValue as STEPS} />
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
                {currentValue === "limitCount" && (
                  <OnboardStepCount form={form} onNext={next} />
                )}
                {currentValue === "notification" && (
                  <>
                    {renderNotificationStep ? (
                      renderNotificationStep({ form, onNext: next })
                    ) : (
                      <OnboardStepNotification form={form} onNext={next} />
                    )}
                  </>
                )}
              </View>
            </OnboardHeaderBoundary>
          )}
        </Stepper>
      </FormProvider>
    </Screen>
  );
};

const OnboardScreen = () => {
  return <OnboardScreenContent />;
};

export default OnboardScreen;

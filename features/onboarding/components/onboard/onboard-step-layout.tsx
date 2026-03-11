import { PropsWithChildren } from "react";
import { View } from "react-native";
import { STEPS } from "../../onboarding.steps";
import OnboardHeader from "./onboard-header";

type Props = {
  stepName: STEPS;
} & PropsWithChildren;

const OnboardStepLayout = ({ children, stepName = "intro" }: Props) => {
  return (
    <View className="flex-1">
      <OnboardHeader stepName={stepName} />
      <View className="flex-1">{children}</View>
    </View>
  );
};

export default OnboardStepLayout;

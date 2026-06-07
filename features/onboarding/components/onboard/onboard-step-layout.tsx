import { createContext, PropsWithChildren, useContext } from "react";
import { View } from "react-native";
import { STEPS } from "../../onboarding.steps";
import OnboardHeader from "./onboard-header";

type Props = {
  stepName: STEPS;
} & PropsWithChildren;

const OnboardHeaderManagedContext = createContext(false);

export const OnboardHeaderBoundary = ({ children }: PropsWithChildren) => {
  return (
    <OnboardHeaderManagedContext.Provider value>
      {children}
    </OnboardHeaderManagedContext.Provider>
  );
};

const OnboardStepLayout = ({ children, stepName }: Props) => {
  const headerManaged = useContext(OnboardHeaderManagedContext);

  return (
    <View className="flex-1">
      {!headerManaged && <OnboardHeader stepName={stepName} />}
      <View className="flex-1">{children}</View>
    </View>
  );
};

export default OnboardStepLayout;

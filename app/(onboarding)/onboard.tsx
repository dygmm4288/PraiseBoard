import OnboardScreen from "@/features/onboarding/screens/OnboardScreen";
import Screen from "@/shared/ui/Screen";

export default function OnboardRoute() {
  return (
    <Screen className="flex-1 flex-col justify-between bg-[#7de0ff]/50">
      <OnboardScreen />
    </Screen>
  );
}

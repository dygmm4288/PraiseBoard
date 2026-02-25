import OnboardScreen from "@/features/onboarding/screens/OnboardScreen";
import { useUser } from "@/features/user-service/UserProvider";
import Screen from "@/shared/components/ui/screens/Screen";
import { useRouter } from "expo-router";

export default function OnboardRoute() {
  const router = useRouter();
  const { completeOnboarding } = useUser();

  const handleContinue = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <Screen className="flex-1 flex-col justify-between bg-[#7de0ff]/50">
      <OnboardScreen />
    </Screen>
  );
}

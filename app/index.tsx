import { useUser } from "@/features/user-service/UserProvider";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const { isInitialized, hasSeenIntro, hasCompletedOnboarding } = useUser();

  if (!isInitialized) return null;

  if (!hasSeenIntro) return <Redirect href='/intro' />;
  if (!hasCompletedOnboarding) return <Redirect href='/onboard' />;

  return <Redirect href='/(tabs)' />;
}

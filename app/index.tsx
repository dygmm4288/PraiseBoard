import BoardScreen from "@/features/board/screens/BoardScreen";
import { useUser } from "@/services/user";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const { isInitialized, hasSeenIntro, hasCompletedOnboarding } = useUser();

  if (!isInitialized) return null;

  if (!hasSeenIntro) return <Redirect href="/intro" />;
  if (!hasCompletedOnboarding) return <Redirect href="/onboard" />;

  return <BoardScreen />;
}

import { BoardProvider } from "@/features/board/hooks";
import BoardScreen from "@/features/board/screens/BoardScreen";
import { useUser } from "@/services/user";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const {
    isInitialized,
    effectiveHasCompletedOnboarding,
    effectiveHasSeenIntro,
  } = useUser();

  if (!isInitialized) return null;

  if (!effectiveHasSeenIntro) return <Redirect href="/intro" />;
  if (!effectiveHasCompletedOnboarding) return <Redirect href="/onboard" />;

  return (
    <BoardProvider>
      <BoardScreen />
    </BoardProvider>
  );
}

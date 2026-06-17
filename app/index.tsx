import { BoardProvider, BoardScreen } from "@/features/board";
import { useUser } from "@/services/user";
import { Redirect } from "expo-router";

export default function IndexRoute() {
  const {
    isInitialized,
    effectiveHasCompletedOnboarding,
    effectiveHasSeenIntro,
  } = useUser();
  // const router = useRouter();
  // router.push("/debug-settings");

  if (!isInitialized) return null;

  if (!effectiveHasSeenIntro) return <Redirect href="/intro" />;
  if (!effectiveHasCompletedOnboarding) return <Redirect href="/onboard" />;

  return (
    <BoardProvider>
      <BoardScreen />
    </BoardProvider>
  );
}

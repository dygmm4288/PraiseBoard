import { isFnbRootPathname } from "@/features/navigation/constants/fnb-paths";
import { useGlobalSearchParams, usePathname } from "expo-router";

const useIsFnbVisible = () => {
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ from?: string; boardId?: string }>();

  return (
    isFnbRootPathname(pathname) &&
    !(pathname === "/" && params.from === "onboarding" && params.boardId)
  );
};

export default useIsFnbVisible;

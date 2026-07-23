import { isFnbRootPathname } from "@/features/navigation/constants/fnb-paths";
import {
  BOTTOM_CONTROL_INSET_GAP,
  FNB_CONTENT_GAP,
  FNB_HEIGHT,
} from "@/shared/constants/layout";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Keeps the last scrollable item above the floating navigation bar while the
 * screen itself remains edge-to-edge.
 */
const useFnbContentInset = () => {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (!isFnbRootPathname(pathname)) return 0;

  return insets.bottom + BOTTOM_CONTROL_INSET_GAP + FNB_HEIGHT + FNB_CONTENT_GAP;
};

export default useFnbContentInset;

import { FNB_METRICS } from "@/shared/constants/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useIsFnbVisible from "./use-is-fnb-visible";

/**
 * Keeps the last scrollable item above the floating navigation bar while the
 * screen itself remains edge-to-edge.
 */
const useFnbContentInset = () => {
  const insets = useSafeAreaInsets();
  const isFnbVisible = useIsFnbVisible();

  if (!isFnbVisible) return 0;

  return (
    insets.bottom +
    FNB_METRICS.bottomGap +
    FNB_METRICS.height +
    FNB_METRICS.contentGap
  );
};

export default useFnbContentInset;

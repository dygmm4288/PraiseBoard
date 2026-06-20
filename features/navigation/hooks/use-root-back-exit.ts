import { toast } from "@/shared/toasts/toast";
import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";

const ROOT_EXIT_PATHNAMES = ["/", "/stats", "/archives", "/settings"];
const BACK_EXIT_INTERVAL_MS = 2000;
const BACK_EXIT_TOAST_MESSAGE = "‘뒤로’ 버튼을 한 번 더 누르면 종료됩니다.";

export const useRootBackExit = (pathname: string) => {
  const lastBackPressedAtRef = useRef(0);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!ROOT_EXIT_PATHNAMES.includes(pathname)) {
          lastBackPressedAtRef.current = 0;
          return false;
        }

        const now = Date.now();
        const shouldExit =
          now - lastBackPressedAtRef.current <= BACK_EXIT_INTERVAL_MS;

        if (shouldExit) {
          BackHandler.exitApp();
          return true;
        }

        lastBackPressedAtRef.current = now;
        toast.chatError(BACK_EXIT_TOAST_MESSAGE, {
          visibilityTime: BACK_EXIT_INTERVAL_MS,
        });
        return true;
      },
    );

    return () => subscription.remove();
  }, [pathname]);
};

export default useRootBackExit;

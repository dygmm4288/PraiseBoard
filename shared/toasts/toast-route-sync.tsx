import { usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { toast } from "./toast";

export const ToastRouteSync = () => {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    toast.hideToast();
  }, [pathname]);

  return null;
};

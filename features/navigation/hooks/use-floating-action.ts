import { useBoardSheet } from "@/features/board";
import { usePathname } from "expo-router";
import { useCallback } from "react";

const useFloatingAction = () => {
  const pathname = usePathname();
  const { openCreateSheet } = useBoardSheet();
  const isVisible = ["/", "/archives"].some((val) => pathname === val);

  const onPressCreate = useCallback(() => {
    openCreateSheet();
  }, [openCreateSheet]);

  return {
    isVisible,
    onPressCreate,
  };
};

export default useFloatingAction;

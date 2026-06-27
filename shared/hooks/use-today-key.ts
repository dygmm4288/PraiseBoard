import { useEffect, useState } from "react";
import { getKstDateKey, getMsUntilNextKstDate } from "@/shared/utils/date";

export const useTodayKey = () => {
  const [todayKey, setTodayKey] = useState(getKstDateKey);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTodayKey(getKstDateKey());
    }, getMsUntilNextKstDate());

    return () => clearTimeout(timeoutId);
  }, [todayKey]);

  return todayKey;
};

export default useTodayKey;

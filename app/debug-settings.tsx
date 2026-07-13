import DebugSettingsScreen from "@/features/debug/debug-settings-screen";
import { isDebugEnabled } from "@/shared/constants/environment";
import { Redirect } from "expo-router";

export default function DebugSettingsRoute() {
  if (!isDebugEnabled) {
    return <Redirect href="/settings" />;
  }

  return <DebugSettingsScreen />;
}

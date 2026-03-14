import { UserProvider, useUser } from "@/services/user";
import { toastConfig } from "@/shared/toasts/toast";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import StorybookUIRoot from "../.rnstorybook";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

const isStorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

const RootLayoutNav = () => {
  const { isInitialized } = useUser();

  if (!isInitialized) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  if (isStorybookEnabled) {
    return <StorybookUIRoot />;
  }

  return (
    <KeyboardProvider>
      <UserProvider>
        <RootLayoutNav />
        <Toast config={toastConfig} />
        <StatusBar style="auto" />
      </UserProvider>
    </KeyboardProvider>
  );
}

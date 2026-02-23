import { UserProvider, useUser } from "@/features/user-service/UserProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

const RootLayoutNav = () => {
  const { isInitialized } = useUser();

  if (!isInitialized) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='modal'
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <>
      <UserProvider>
        <RootLayoutNav />
        <StatusBar style='auto' />
      </UserProvider>
    </>
  );
}

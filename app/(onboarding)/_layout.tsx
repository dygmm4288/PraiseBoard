import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="intro"
        options={{ contentStyle: { backgroundColor: "#000000" } }}
      />
      <Stack.Screen
        name="onboard"
        options={{ contentStyle: { backgroundColor: "#FFFFFF" } }}
      />
    </Stack>
  );
}

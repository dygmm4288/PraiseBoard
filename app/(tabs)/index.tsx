import { useUser } from "@/features/user-service/UserProvider";
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { resetOnboardingProgress } = useUser();

  const handleResetOnboarding = async () => {
    await resetOnboardingProgress();
    router.replace("/");
  };

  return (
    <View className='flex-1 items-center justify-center gap-4 bg-white'>
      <Text className='text-xl text-gray-500'>Welcome to NativeWind</Text>
      <Link href='/signup'>to signup</Link>
      {__DEV__ ? (
        <TouchableOpacity
          className='rounded-xl bg-red-500 px-4 py-3'
          onPress={handleResetOnboarding}>
          <Text className='text-white'>Dev: Intro/Onboarding Reset</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

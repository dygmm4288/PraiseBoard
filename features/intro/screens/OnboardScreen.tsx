import { useUser } from "@/features/user-service/UserProvider";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const OnboardScreen = () => {
  const router = useRouter();
  const { completeOnboarding } = useUser();

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View className='flex-1 items-center justify-center gap-4 bg-white px-6'>
      <Text className='text-2xl font-bold'>Onboarding</Text>
      <TouchableOpacity
        className='rounded-xl bg-blue-500 px-4 py-3'
        onPress={handleComplete}>
        <Text className='text-white'>완료하고 홈으로</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OnboardScreen;

import { useUser } from "@/features/user-service/UserProvider";
import { AppButton, AppText } from "@/shared/components/ui";
import { useRouter } from "expo-router";
import { View } from "react-native";

const OnboardScreen = () => {
  const router = useRouter();
  const { completeOnboarding } = useUser();

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <View className='flex-1 items-center justify-center gap-4 bg-white px-6'>
      <AppText variant='title'>Onboarding</AppText>
      <AppButton label='완료하고 홈으로' onPress={handleComplete} />
    </View>
  );
};

export default OnboardScreen;

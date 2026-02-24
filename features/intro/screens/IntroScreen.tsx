import { useUser } from "@/features/user-service/UserProvider";
import { AppButton, AppText } from "@/shared/components/ui";
import { useRouter } from "expo-router";
import { View } from "react-native";

const IntroScreen = () => {
  const router = useRouter();
  const { completeIntro } = useUser();

  const handleNext = async () => {
    await completeIntro();
    router.replace("/onboard");
  };

  return (
    <View className='flex-1 items-center justify-center gap-4 bg-white px-6'>
      <AppText variant='title'>Intro</AppText>
      <AppButton label='온보딩으로 이동' onPress={handleNext} />
    </View>
  );
};

export default IntroScreen;

import { useUser } from "@/features/user-service/UserProvider";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const IntroScreen = () => {
  const router = useRouter();
  const { completeIntro } = useUser();

  const handleNext = async () => {
    await completeIntro();
    router.replace("/onboard");
  };

  return (
    <View className='flex-1 items-center justify-center gap-4 bg-white px-6'>
      <Text className='text-2xl font-bold'>Intro</Text>
      <TouchableOpacity
        className='rounded-xl bg-blue-500 px-4 py-3'
        onPress={handleNext}>
        <Text className='text-white'>온보딩으로 이동</Text>
      </TouchableOpacity>
    </View>
  );
};

export default IntroScreen;

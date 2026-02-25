import { useUser } from "@/features/user-service/UserProvider";
import { AppButton, AppText } from "@/shared/components/ui";
import AppInput from "@/shared/components/ui/input";
import useInput from "@/shared/hooks/useInput";
import { Link, useRouter } from "expo-router";
import { View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { resetOnboardingProgress } = useUser();

  const handleResetOnboarding = async () => {
    await resetOnboardingProgress();
    router.replace("/");
  };

  const [value, handleValue, setValue] = useInput();

  return (
    <View className='flex-1 items-center justify-center gap-4 bg-white'>
      <AppText variant='title' tone='muted'>
        Welcome to NativeWind
      </AppText>
      <Link href='/signup'>to signup</Link>
      {__DEV__ ? (
        <AppButton
          label='Dev: Intro/Onboarding Reset'
          variant='danger'
          onPress={handleResetOnboarding}></AppButton>
      ) : null}
      <AppInput
        placeholder='입력하세요'
        value={value}
        onChangeText={handleValue}
        reset
        onReset={() => setValue("")}
      />
    </View>
  );
}

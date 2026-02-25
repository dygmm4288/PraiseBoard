import { useUser } from "@/features/user-service/UserProvider";
import { AppButton, AppText } from "@/shared/components/ui";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardRoute() {
  const router = useRouter();
  const { completeOnboarding } = useUser();

  const handleContinue = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-6 py-8 justify-between'>
        <View className='gap-3'>
          <AppText variant='caption' tone='muted'>
            Onboarding
          </AppText>
          <AppText variant='title'>온보딩 페이지 준비 중</AppText>
          <AppText tone='muted'>
            intro 이후에 보여줄 onboarding 화면은 아직 구현되지 않았습니다.
          </AppText>
          <AppText tone='muted'>
            임시로 아래 버튼을 누르면 onboarding 완료 처리 후 메인으로 이동합니다.
          </AppText>
        </View>

        <AppButton fullWidth label='임시로 계속하기' onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

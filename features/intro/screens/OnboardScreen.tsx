import { useUser } from "@/features/user-service/UserProvider";
import { OnboardingPageLayout, StepDots } from "@/shared/components/flow";
import { AppButton, AppText } from "@/shared/components/ui";
import { useRouter } from "expo-router";

const OnboardScreen = () => {
  const router = useRouter();
  const { completeOnboarding } = useUser();

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace("/(tabs)");
  };

  return (
    <OnboardingPageLayout
      title={<AppText variant='title'>Title</AppText>}
      footer={
        <>
          <StepDots total={2} current={1} />
          <AppButton fullWidth label='시작하기' onPress={handleComplete} />
        </>
      }>
      <AppText tone='muted'>아무도 모르는 사소한 일도 괜찮아요.</AppText>
      <AppText tone='muted'>
        작은 성취를 기록하고 스스로를 칭찬해 주세요.
      </AppText>
    </OnboardingPageLayout>
  );
};

export default OnboardScreen;

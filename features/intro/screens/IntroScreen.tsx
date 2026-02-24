import { useUser } from "@/features/user-service/UserProvider";
import { OnboardingPageLayout, StepDots } from "@/shared/components/flow";
import { AppButton, AppText } from "@/shared/components/ui";
import { useRouter } from "expo-router";

const IntroScreen = () => {
  const router = useRouter();
  const { completeIntro } = useUser();

  const handleNext = async () => {
    await completeIntro();
    router.replace("/onboard");
  };

  return (
    <OnboardingPageLayout
      title={<AppText variant='title'>text</AppText>}
      footer={
        <>
          <StepDots total={2} current={0} />
          <AppButton fullWidth label='다음' onPress={handleNext} />
        </>
      }>
      <AppText tone='muted'>내 하루는 누가 알아주나요?</AppText>
      <AppText tone='muted'>
        결과보다 과정을 먼저 봐주는 친구를 만나보세요.
      </AppText>
    </OnboardingPageLayout>
  );
};

export default IntroScreen;

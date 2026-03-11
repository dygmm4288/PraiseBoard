import PaginationIndicator from "@/shared/components/pagination-indicator";
import { AppText } from "@/shared/ui";
import React from "react";
import { View } from "react-native";

type Props = {
  currentIndex: number;
};

export default function IntroContent({ currentIndex }: Props) {
  const title = [
    "내 하루는\n누가 알아주나요?",
    "나만 아는\n사소한 일도 괜찮아요",
  ][currentIndex];
  const content = [
    "과도한 결과 중독 사회에서 우리는 지치기 쉬워요.\n결과보다 과정의 의미를 찾고 따뜻하게 칭찬해주는\n고래친구 두잉을 만나보세요.",
    "당신이 원하는 무엇이든 기록할 수 있어요.\n행동을 하나씩 쌓아가며 스스로 칭찬하고 보상을 얻어봐요.\n두잉이 곁에서 지켜줄거예요.",
  ][currentIndex];

  return (
    <View className="w-full items-center gap-[20px]">
      <AppText variant="title2" weight="bold" className="w-full text-center ">
        {title}
      </AppText>
      <AppText variant="body2" weight="regular" className="w-full text-center">
        {content}
      </AppText>
      <View className="items-center justify-center">
        <PaginationIndicator totalCnt={2} currentIndex={currentIndex} />
      </View>
    </View>
  );
}

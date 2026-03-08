import { AppText } from "@/shared/ui";
import React from "react";
import { View } from "react-native";

type Props = {
  currentIndex: number;
};

export default function IntroContent({ currentIndex }: Props) {
  const texts = [
    [
      "내 하루는 누가 알아주나요?",
      "결과보다 과정을 먼저 봐주는 친구를 만나보세요.",
    ],
    [
      "아무도 모르는 사소한 일도 괜찮아요.",
      "작은 성취를 기록하고 스스로를 칭찬해 주세요.",
    ],
  ][currentIndex];

  return (
    <View className='flex flex-col gap-5 '>
      <AppText tone='muted'>{currentIndex + 1} / 2 </AppText>
      <View>
        {texts.map((v, i) => (
          <AppText
            key={`intro_content${currentIndex}${i}`}
            variant='title'
            weight='bold'
            className='whitespace-normal'>
            {v}
          </AppText>
        ))}
      </View>
    </View>
  );
}

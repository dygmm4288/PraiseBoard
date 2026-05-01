import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

type BoardWhaleMessageProps = {
  todayStickerCount: number;
  latestStickerCollectedAt: string | null;
  className?: string;
};

const WHALE_LINES = [
  {
    minCount: 0,
    body: "오늘의 첫 파도를 일으킬 준비가 됐어? 깊은 곳에서 네가 오기만을 기다리고 있어.",
  },
  {
    minCount: 1,
    body: "작은 파동이 바다 깊은 곳까지 닿았어. 내가 느꼈어. 그것만으로도 충분해.",
  },
  {
    minCount: 2,
    body: "두 번. 네 파동이 바다에 퍼지고 있어. 고래들이 수면 가까이 올라오고 있어.",
  },
  {
    minCount: 3,
    body: "세 개의 물결이야. 오늘 바다가 유난히 따뜻해. 깊은 곳까지 네 목소리가 들려.",
  },
  {
    minCount: 4,
    body: "네 번이나 해냈네. 오늘 너는 조류 자체를 바꾸고 있어. 정말 대단해.",
  },
] as const;

const resolveWhaleLine = (count: number) =>
  [...WHALE_LINES].reverse().find((line) => count >= line.minCount) ??
  WHALE_LINES[0];

const formatCollectedTime = (value: string | null) => {
  if (!value) return "오늘의 첫 성취를 기다리는 중";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "마지막 성취 시각을 확인할 수 없어요";

  return `마지막 성취 · ${date.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};

const BoardWhaleMessage = ({
  todayStickerCount,
  latestStickerCollectedAt,
  className,
}: BoardWhaleMessageProps) => {
  const line = resolveWhaleLine(todayStickerCount);

  return (
    <LinearGradient
      colors={["#B696FF", "#D2BFFF", "#F4EFFF"]}
      start={{ x: 0.08, y: 0 }}
      end={{ x: 0.95, y: 1 }}
      className={cn("overflow-hidden rounded-[24px]", className)}
    >
      <View className="relative px-[22px] py-[22px]">
        <View className="absolute right-[22px] top-[18px] h-[24px] w-[24px] rounded-full bg-primary-200 opacity-60" />
        <AppText
          variant="caption2"
          weight="semibold"
          className="mb-[7px] text-primary-700/60"
        >
          {formatCollectedTime(latestStickerCollectedAt)}
        </AppText>
        <AppText
          variant="body3"
          className="text-primary-800/80 leading-[24px]"
        >
          {line.body}
        </AppText>
      </View>
    </LinearGradient>
  );
};

export default BoardWhaleMessage;

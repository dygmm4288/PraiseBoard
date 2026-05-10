import { images } from "@/assets/images";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { LinearGradient } from "expo-linear-gradient";
import { Image, View } from "react-native";
import type { WhaleMessage } from "../../domain/whale-message-policy";
import { resolveWhaleMessage } from "../../domain/whale-message-policy";
import { BoardRecord } from "../../types";

type BoardWhaleMessageProps = {
  message?: WhaleMessage;
  todayStickerCount?: number;
  latestStickerCollectedAt?: string | null;
  nickname?: string | null;
  boards?: BoardRecord[];
  lastLoginAt?: string | null;
  className?: string;
};

const formatCollectedTime = (value: string | null) => {
  if (!value) return "오늘의 첫 성취를 기다리는 중";

  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    return "마지막 성취 시각을 확인할 수 없어요";

  return `마지막 성취 · ${date.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};

const BoardWhaleMessage = ({
  message,
  todayStickerCount = 0,
  latestStickerCollectedAt = null,
  nickname,
  boards,
  lastLoginAt,
  className,
}: BoardWhaleMessageProps) => {
  const whaleMessage =
    message ??
    resolveWhaleMessage({
      nickname,
      todayStickerCount,
      boards,
      lastLoginAt,
    });

  return (
    <View className={cn("overflow-hidden rounded-[20px]", className)}>
      <LinearGradient
        colors={["#C5B3FA", "#EBE6FF"]}
        start={{ x: 0.5, y: 0 }}
        locations={[0, 0.9038]}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: "relative",
          paddingHorizontal: 18,
          paddingVertical: 20,
          gap: 12,
        }}
      >
        <View className="flex flex-row gap-[8px] pb-[12px] border-b border-b-[#C9BDF4]">
          <View className="h-[33px] w-[33px] rounded-full bg-primary-200 flex justify-center items-center">
            <Image height={33} width={33} source={images.whaleMessages.whale} />
          </View>
          <View className="flex-col gap-[3px]">
            <AppText variant="button2" weight="bold" className="text-[#8775cc]">
              두잉
            </AppText>
            <AppText
              variant="button2"
              weight="regular"
              className="text-[#8f7ed0]"
            >
              마지막 메시지
            </AppText>
          </View>
        </View>
        <View>
          <AppText
            variant="caption1"
            weight="medium"
            className="text-[#4b3c71] leading-[25px]"
          >
            {whaleMessage.body}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BoardWhaleMessage;

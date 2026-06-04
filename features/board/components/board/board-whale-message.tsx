import type { WhaleMessage } from "@/services/whale-message";
import { resolveWhaleMessage } from "@/services/whale-message";
import WhaleAvatar from "@/shared/components/whale-avatar";
import { COLOR } from "@/shared/constants/colors.constant";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { BoardRecord } from "../../types";

type BoardWhaleMessageProps = {
  message?: WhaleMessage;
  todayStickerCount?: number;
  latestMessageCreatedAt?: string | null;
  nickname?: string | null;
  boards?: BoardRecord[];
  lastLoginAt?: string | null;
  className?: string;
};

const formatLatestMessageLabel = (value: string | null) => {
  if (!value) return "마지막 메시지";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "마지막 메시지";

  return `마지막 메시지 - ${date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
};

const BoardWhaleMessage = ({
  message,
  todayStickerCount = 0,
  latestMessageCreatedAt = null,
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
        colors={[COLOR.whale.gradientStart, COLOR.whale.gradientEnd]}
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
        <View className="flex flex-row gap-[8px] pb-[12px] border-b border-b-primary-15">
          <WhaleAvatar />
          <View className="flex-col gap-[3px]">
            <AppText
              variant="button2"
              weight="bold"
              className="text-primary-50"
            >
              두잉
            </AppText>
            <AppText
              variant="button2"
              weight="regular"
              className="text-textLightPurple"
            >
              {formatLatestMessageLabel(latestMessageCreatedAt)}
            </AppText>
          </View>
        </View>
        <View>
          <AppText
            variant="caption1"
            weight="medium"
            className="text-textDarkPurple leading-[25px]"
          >
            {whaleMessage.body}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BoardWhaleMessage;

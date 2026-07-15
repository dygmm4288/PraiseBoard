import type { WhaleMessage } from "@/services/whale-message";
import { resolveWhaleMessage } from "@/services/whale-message";
import WhaleAvatar from "@/shared/components/whale-avatar";
import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";
import { BOARD_COLORS } from "../../theme/colors";
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

  return `마지막 메시지 · ${date.toLocaleTimeString("ko-KR", {
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
        colors={[
          BOARD_COLORS.whale.gradientStart,
          BOARD_COLORS.whale.gradientEnd,
        ]}
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
        <View
          className="flex flex-row gap-[8px] border-b pb-[12px]"
          style={{ borderBottomColor: BOARD_COLORS.whale.border }}
        >
          <WhaleAvatar />
          <View className="flex-col gap-[3px]">
            <AppText
              variant="label12"
              weight="semibold"
              style={{ color: BOARD_COLORS.whale.label }}
            >
              두잉
            </AppText>
            <AppText
              variant="label10"
              weight="regular"
              style={{ color: BOARD_COLORS.whale.timestamp }}
            >
              {formatLatestMessageLabel(latestMessageCreatedAt)}
            </AppText>
          </View>
        </View>
        <View>
          <AppText
            variant="button15"
            weight="medium"
            style={{ color: BOARD_COLORS.whale.text }}
          >
            {whaleMessage.body}
          </AppText>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BoardWhaleMessage;

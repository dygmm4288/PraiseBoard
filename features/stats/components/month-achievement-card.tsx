import { AppText } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { View } from "react-native";
import { StatBoardItem } from "../types";
import StatsCard from "./stats-card";
import StatsSectionHeader from "./stats-section-header";

type MonthAchievementCardProps = {
  items: StatBoardItem[];
  totalCount: number;
  statusMessage?: string | null;
};

type MonthAchievementRowProps = {
  item: StatBoardItem;
  showBorder: boolean;
};

const formatBoardCount = ({ currentCount, targetCount }: StatBoardItem) => {
  if (!targetCount) return `${currentCount}/0`;
  return `${currentCount}/${targetCount}`;
};

const MonthAchievementRow = ({
  item,
  showBorder,
}: MonthAchievementRowProps) => {
  return (
    <View
      className={cn(
        "flex-row items-center justify-between",
        showBorder && "border-t border-line-subtle pt-[16px]",
      )}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-[3px]">
        <AppText variant="body14" className="shrink-0">
          {item.emoji}
        </AppText>
        <AppText
          variant="body14"
          className="min-w-0 flex-1 text-black"
          numberOfLines={1}
        >
          {item.title}
        </AppText>
      </View>
      <AppText variant="body14" className="shrink-0 text-black">
        {formatBoardCount(item)}
      </AppText>
    </View>
  );
};

const MonthAchievementState = ({ message }: { message: string }) => {
  return (
    <View className="min-h-[80px] items-center justify-center px-[20px] py-[18px]">
      <AppText variant="body14" className="text-center text-neutral-500">
        {message}
      </AppText>
    </View>
  );
};

const MonthAchievementCard = ({
  items,
  totalCount,
  statusMessage,
}: MonthAchievementCardProps) => {
  return (
    <StatsCard>
      <View className="border-b border-line-subtle pb-[15px]">
        <StatsSectionHeader label="이번 달 성취" value={`총 ${totalCount}번`} />
      </View>
      {statusMessage ? (
        <MonthAchievementState message={statusMessage} />
      ) : (
        <View className="gap-[15px] pt-[16px]">
          {items.map((item, index) => (
            <MonthAchievementRow
              key={item.id}
              item={item}
              showBorder={index > 0}
            />
          ))}
        </View>
      )}
    </StatsCard>
  );
};

export default MonthAchievementCard;

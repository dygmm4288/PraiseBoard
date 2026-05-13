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
        showBorder && "border-t border-[#EFF1F5] pt-[16px]",
      )}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-[3px]">
        <AppText variant="body3" weight="semibold" className="shrink-0">
          {item.emoji}
        </AppText>
        <AppText
          variant="body3"
          className="min-w-0 flex-1 text-gray-900"
          numberOfLines={1}
        >
          {item.title}
        </AppText>
      </View>
      <AppText variant="body3" className="shrink-0 text-gray-900">
        {formatBoardCount(item)}
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
    <StatsCard className="gap-[15px]">
      <StatsSectionHeader label="이번 달 성취" value={`총 ${totalCount}번`} />
      {statusMessage ? (
        <AppText variant="body3" className="text-center text-gray-500">
          {statusMessage}
        </AppText>
      ) : (
        items.map((item, index) => (
          <MonthAchievementRow
            key={item.id}
            item={item}
            showBorder={index > 0}
          />
        ))
      )}
    </StatsCard>
  );
};

export default MonthAchievementCard;

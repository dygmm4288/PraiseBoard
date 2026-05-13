import { Calendar, CalendarStickerCount } from "@/shared/components";
import { AppText, Screen } from "@/shared/ui";
import { cn } from "@/shared/utils/cn";
import { ScrollView, View } from "react-native";

type StatBoardItem = {
  id: string;
  emoji: string;
  title: string;
  currentCount: number;
  targetCount: number;
};

const CARD_SHADOW_COLOR = "#4B3C71";

const MONTH_DATE = new Date(2026, 4, 1);

const MONTH_STICKER_COUNTS: CalendarStickerCount[] = [
  { date: "2026-05-03", count: 2 },
  { date: "2026-05-05", count: 5 },
  { date: "2026-05-06", count: 2 },
  { date: "2026-05-07", count: 2 },
  { date: "2026-05-08", count: 3 },
  { date: "2026-05-09", count: 5 },
];

const MONTH_BOARD_ITEMS: StatBoardItem[] = [
  {
    id: "guitar",
    emoji: "🎸",
    title: "퇴근 후 악기 연습",
    currentCount: 3,
    targetCount: 28,
  },
  {
    id: "board-1",
    emoji: "🌱",
    title: "#보드 제목",
    currentCount: 0,
    targetCount: 0,
  },
  {
    id: "board-2",
    emoji: "🌱",
    title: "#보드 제목",
    currentCount: 0,
    targetCount: 0,
  },
  {
    id: "board-3",
    emoji: "🌱",
    title: "#보드 제목",
    currentCount: 0,
    targetCount: 0,
  },
];

const getMonthTitle = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 통계`;

const getMonthTotal = (items: StatBoardItem[]) =>
  items.reduce((total, item) => total + item.currentCount, 0);

const formatBoardCount = ({ currentCount, targetCount }: StatBoardItem) => {
  if (!targetCount) return "N/N";
  return `${currentCount}/${targetCount}`;
};

const StatsCard = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <View
      className={cn("rounded-[20px] bg-white px-[20px] py-[16px]", className)}
      style={{
        shadowColor: CARD_SHADOW_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
};

const StatsSectionHeader = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <View className="flex-row items-center justify-between">
      <AppText variant="caption1" weight="semibold" className="text-[#8E8E95]">
        {label}
      </AppText>
      <AppText variant="title3" weight="bold" className="text-primary-500">
        {value}
      </AppText>
    </View>
  );
};

const MonthAchievementRow = ({
  item,
  showBorder,
}: {
  item: StatBoardItem;
  showBorder: boolean;
}) => {
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
        <AppText variant="body3" className="min-w-0 flex-1 text-gray-900" numberOfLines={1}>
          {item.title}
        </AppText>
      </View>
      <AppText variant="body3" className="shrink-0 text-gray-900">
        {formatBoardCount(item)}
      </AppText>
    </View>
  );
};

const MonthAchievementCard = () => {
  return (
    <StatsCard className="gap-[15px]">
      <StatsSectionHeader
        label="이번 달 성취"
        value={`총 ${getMonthTotal(MONTH_BOARD_ITEMS)}번`}
      />
      {MONTH_BOARD_ITEMS.map((item, index) => (
        <MonthAchievementRow
          key={item.id}
          item={item}
          showBorder={index > 0}
        />
      ))}
    </StatsCard>
  );
};

const MonthStreakCard = () => {
  return (
    <StatsCard>
      <StatsSectionHeader label="이번 달 연속 성취 기록" value="N일" />
    </StatsCard>
  );
};

const StatsScreen = () => {
  return (
    <Screen className="pb-[120px]">
      <View className="h-[45px] justify-center px-[8px]">
        <AppText variant="button1" className="text-gray-850">
          {getMonthTitle(MONTH_DATE)}
        </AppText>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 12, paddingTop: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Calendar
          defaultDate={MONTH_DATE}
          stickerCounts={MONTH_STICKER_COUNTS}
        />
        <MonthAchievementCard />
        <MonthStreakCard />
      </ScrollView>
    </Screen>
  );
};

export default StatsScreen;

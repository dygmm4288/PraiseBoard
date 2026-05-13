import { useUser } from "@/services/user";
import { Calendar } from "@/shared/components";
import { AppText, Screen } from "@/shared/ui";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import MonthAchievementCard from "../components/month-achievement-card";
import MonthStreakCard from "../components/month-streak-card";
import StatsCard from "../components/stats-card";
import { useStatsMonthQuery } from "../queries/use-stats-month-query";

const getMonthTitle = (date: Date) =>
  `${date.getFullYear()}년 ${date.getMonth() + 1}월 통계`;

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const StatsStatusText = ({ message }: { message: string }) => {
  return (
    <AppText variant="body3" className="text-center text-gray-500">
      {message}
    </AppText>
  );
};

const StatsScreen = () => {
  const { profileId } = useUser();
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const { data, isLoading, error } = useStatsMonthQuery(
    profileId,
    formatMonthKey(monthDate),
  );

  const getAchievementStatusMessage = () => {
    if (isLoading) return "성취를 불러오는 중이에요.";
    if (error) return "성취를 불러오는 중 오류가 발생했어요.";
    if (!data?.boardItems.length) return "아직 표시할 보드가 없어요.";
    return null;
  };

  return (
    <Screen>
      <View className="h-[45px] justify-center px-[8px]">
        <AppText variant="button1" className="text-gray-850">
          {getMonthTitle(monthDate)}
        </AppText>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 12, paddingTop: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <Calendar
          defaultDate={monthDate}
          onMonthChange={setMonthDate}
          stickerCounts={data?.stickerCounts ?? []}
        />
        {!profileId ? (
          <StatsCard>
            <StatsStatusText message="프로필 정보를 확인할 수 없어요." />
          </StatsCard>
        ) : (
          <>
            <MonthAchievementCard
              items={data?.boardItems ?? []}
              totalCount={data?.totalCount ?? 0}
              statusMessage={getAchievementStatusMessage()}
            />
            <MonthStreakCard streakDays={data?.maxStreak ?? 0} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
};

export default StatsScreen;

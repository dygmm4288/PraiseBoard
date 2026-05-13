import StatsCard from "./stats-card";
import StatsSectionHeader from "./stats-section-header";

type Props = {
  streakDays: number | null;
};

const MonthStreakCard = ({ streakDays }: Props) => {
  return (
    <StatsCard>
      <StatsSectionHeader
        label="이번 달 연속 성취 기록"
        value={`${streakDays ?? 0}일`}
      />
    </StatsCard>
  );
};

export default MonthStreakCard;

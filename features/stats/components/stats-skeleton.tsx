import { Skeleton } from "@/shared/ui";
import { View } from "react-native";
import StatsCard from "./stats-card";

const StatsSkeleton = () => {
  return (
    <View
      accessibilityLabel="통계 정보를 불러오는 중"
      accessibilityRole="progressbar"
      className="gap-[12px]"
    >
      <StatsCard className="pt-[24px]">
        <View className="mb-[24px] flex-row items-center justify-between">
          <Skeleton width={24} height={24} borderRadius={12} />
          <Skeleton width={92} height={18} />
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
        <View className="gap-[11px]">
          <View className="flex-row justify-between">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton key={`week-label-${index}`} width={20} height={12} />
            ))}
          </View>
          <View className="gap-[3px]">
            {Array.from({ length: 5 }, (_, rowIndex) => (
              <View
                key={`week-${rowIndex}`}
                className="flex-row justify-between"
              >
                {Array.from({ length: 7 }, (_, columnIndex) => (
                  <Skeleton
                    key={`day-${rowIndex}-${columnIndex}`}
                    width={45}
                    height={45}
                    borderRadius={9}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </StatsCard>

      <StatsCard>
        <View className="flex-row items-center justify-between border-b border-line-subtle pb-[15px]">
          <Skeleton width={76} height={14} />
          <Skeleton width={52} height={18} />
        </View>
        <View className="gap-[15px] pt-[16px]">
          {Array.from({ length: 3 }, (_, index) => (
            <View
              key={`achievement-${index}`}
              className="flex-row items-center justify-between"
            >
              <Skeleton width="56%" height={16} />
              <Skeleton width={42} height={16} />
            </View>
          ))}
        </View>
      </StatsCard>

      <StatsCard>
        <View className="flex-row items-center justify-between">
          <Skeleton width={132} height={14} />
          <Skeleton width={38} height={18} />
        </View>
      </StatsCard>
    </View>
  );
};

export default StatsSkeleton;
